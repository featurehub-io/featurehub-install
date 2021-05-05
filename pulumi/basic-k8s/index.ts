import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import { FeatureHubVolume, FeatureHubVolumeType, VolumeDeployments } from './volumes';
import * as fs from 'fs';
import { ServiceDeployment } from './service_deployment';
import { PersistentVolume } from '@pulumi/kubernetes/core/v1';
import { PersistentVolumeClaim } from '@pulumi/kubernetesx';
import { Ingress } from '@pulumi/kubernetes/networking/v1';

const config = new pulumi.Config();
const isLinux = config.requireBoolean("isLinux");

function loadVolumesContent() : FeatureHubVolume[] {
  const vols: FeatureHubVolume[] = [];

  // vols.push({
  //   name: 'app-config',
  //   mountPath: '/etc/app-config',
  //   type: FeatureHubVolumeType.ConfigMap,
  //   items: [{
  //     name: 'application.properties',
  //   }]
  // });
  //
  // vols.push({
  //   name: 'common-config',
  //   mountPath: '/etc/common-config',
  //   type: FeatureHubVolumeType.ConfigMap,
  //   items: [{
  //     name: 'log4j2.xml'
  //   }]
  // });
  //
  // vols.push({
  //   name: 'dacha-config',
  //   mountPath: '/etc/app-config',
  //   type: FeatureHubVolumeType.ConfigMap,
  //   items: [{
  //     name: 'application.properties'
  //   }]
  // });
  //
  // vols.push({
  //   name: 'edge-config',
  //   mountPath: '/etc/app-config',
  //   type: FeatureHubVolumeType.ConfigMap,
  //   items: [{
  //     name: 'application.properties'
  //   }]
  // });

  vols.push({
    name: 'postgres-init',
    mountPath: '/docker-entrypoint-initdb.d',
    type: FeatureHubVolumeType.ConfigMap,
    items: [{
      name: 'initdb.sql'
    }]
  });

  vols.push({
    name: 'nats-config',
    mountPath: '/etc/nats-config',
    type: FeatureHubVolumeType.ConfigMap,
    items: [{
      name: 'nats.conf'
    }]
  });

  // now load the content
  vols.forEach(vols => vols.items.forEach(item => item.content = fs.readFileSync(vols.name + "/" + item.name).toString()))

  return vols;
}

const vols = loadVolumesContent();

new VolumeDeployments(vols);

function postgres() {
  const postgres_pvc = new PersistentVolumeClaim("postgres-data-pvc", {
    metadata: {
      // required because otherwise the PVC will go into Pending and Pulimi will wait for
      // it to bind before moving on. Which prevents it from carrying on because the thing
      // that binds to it needs it bound to create
      annotations: {"pulumi.com/skipAwait": "true"}
    },
    spec: {
      storageClassName: "standard",
      accessModes: ["ReadWriteOnce"],
      resources: {
        requests: {
          storage: "128Mi"
        }
      }
    }
  });

  vols.push({
    name: 'postgresql',
    mountPath: '/var/lib/postgresql',
    type: FeatureHubVolumeType.Pvc,
    resource: postgres_pvc.metadata,
    items: []
  });

  // this should be optional, as deploying with an embedded postgres is a bad idea
  new ServiceDeployment('db', {
    image: 'postgres:12-alpine',
    env: [{name: 'POSTGRES_PASSWORD', value: 'mypassword'}],
    volumes: vols,
    replicas: 1,
    strategy: {
      rollingUpdate: {
        maxUnavailable: 1
      }
    },
    volumeNames: ['postgresql', 'postgres-init'],
    ports: [{port: 5432}]
  });
}



// this needs a much better cluster configuration, but its not important right now
function nats2() {
  new ServiceDeployment('nats', {
    image: 'nats:2.1.7-alpine',
    isMinikube: true,
    ports: [{name: 'client', port: 4222}, {port: 8222, name: 'monitoring'}],
    volumes: vols,
    command: ["nats-server", "--config", "/etc/nats-config/nats.conf"],
    volumeNames: ['nats-config'],
    healthCheck: {port: 8222}
  });
}

function managementServer(): ServiceDeployment {
  return new ServiceDeployment('mr', {
    image: 'featurehub/mr:1.3.0',
    isMinikube: true,
    ports: [{name: 'web', port: 8085, targetPort: 80}],
    volumes: vols,
    volumeNames: ['app-config', 'common-config'],
  })
}

function dacha(): ServiceDeployment {
  return new ServiceDeployment('dacha', {
    image: 'featurehub/dacha:1.3.0',
    isMinikube: true,
    ports: [{name: 'web', port: 8600}],
    volumes: vols,
    volumeNames: ['dacha-config', 'common-config']
  })
}

function edge(): ServiceDeployment {
  return new ServiceDeployment('edge', {
    image: 'featurehub/edge:1.3.0',
    isMinikube: true,
    ports: [{name: 'web', port: 8553}],
    volumes: vols,
    volumeNames: ['edge-config', 'common-config']
  })
}

function featurehub() {
  const mr = managementServer();
  dacha();
  const edgeServer = edge();


  function ingress() {
    new Ingress('featurehub', {
      spec: {
        defaultBackend: {
          service: {
            name: mr.service.metadata.name,
            port: {name: 'web'}
          }
        },
        rules: [{
          http: {
            paths: [
              {
                path: '/features',
                pathType: "Prefix",
                backend: {
                  service: {
                    name: edgeServer.service.metadata.name,
                    port: {name: 'web'}
                  }
                }
              }
            ]
          }
        }]
      }
    });
  }

  ingress();
}

postgres();
nats2();

//export const name = deployment.metadata.name;
