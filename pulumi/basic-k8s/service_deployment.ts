import * as k8s from "@pulumi/kubernetes";
import * as k8stypes from "@pulumi/kubernetes/types/input";
import * as pulumi from "@pulumi/pulumi";
import { FeatureHubVolume, FeatureHubVolumeType } from './volumes';
import { input as inputs } from '@pulumi/kubernetes/types';
import { apps, core } from '@pulumi/kubernetes/types/input';
import Volume = core.v1.Volume;
import DeploymentStrategy = apps.v1.DeploymentStrategy;

/**
 * ServiceDeployment is an example abstraction that uses a class to fold together the common pattern of a
 * Kubernetes Deployment and its associated Service object.
 */
export class ServiceDeployment extends pulumi.ComponentResource {
  public readonly deployment: k8s.apps.v1.Deployment;
  public readonly service: k8s.core.v1.Service;
  public readonly ipAddress?: pulumi.Output<string>;

  constructor(name: string, args: ServiceDeploymentArgs, opts?: pulumi.ComponentResourceOptions) {
    super("k8sjs:service:ServiceDeployment", name, {}, opts);

    const labels = {app: name};

    // check all the volumes are there
    if (args.volumeNames !== undefined) {
      args.volumeNames.forEach(vn => {
        if (args.volumes?.find(v => v.name === vn) === undefined) {
          throw new Error(`No volume ${vn} in list of volumes`);
        }
      })
    }

    const container: k8stypes.core.v1.Container = this._getContainer(name, args);

    this.deployment = this._createDeployment(name, labels, args, container);

    this.service = this._createService(name, args);

    if (args.allocateIpAddress) {
      this.ipAddress = args.isMinikube ?
        this.service.spec.clusterIP :
        this.service.status.loadBalancer.ingress[0].ip;
    }
  }

  private _createService(name: string, args: ServiceDeploymentArgs) {
    return new k8s.core.v1.Service(name, {
      metadata: {
        name: name,
        labels: this.deployment.metadata.labels,
      },
      spec: {
        ports: args.ports && args.ports.map(p => ({port: p.port, targetPort: p.targetPort || p.port, name: p.name})),
        selector: this.deployment.spec.template.metadata.labels,
        // Minikube does not implement services of type `LoadBalancer`; require the user to specify if we're
        // running on minikube, and if so, create only services of type ClusterIP.
        type: args.allocateIpAddress ? (args.isMinikube ? "ClusterIP" : "LoadBalancer") : undefined,
      },
    }, {parent: this});
  }

  private _createDeployment(name: string, labels: { app: string }, args: ServiceDeploymentArgs, container: k8stypes.core.v1.Container): k8s.apps.v1.Deployment {
    return new k8s.apps.v1.Deployment(name, {
      metadata: {
        // required because otherwise the PVC will go into Pending and Pulimi will wait for
        // it to bind before moving on. Which prevents it from carrying on because the thing
        // that binds to it needs it bound to create
        annotations: {"pulumi.com/skipAwait": "true"}
      },
      spec: {
        selector: {matchLabels: labels},
        replicas: args.replicas || 1,
        strategy: args.strategy,
        template: {
          metadata: {labels: labels},
          spec: {
            containers: [container],
            volumes: args.volumeNames?.map(vn => {
              const vol = args.volumes?.find(v => v.name == vn);

              const cm: k8stypes.core.v1.Volume = {
                name: vn,
              };

              if (vol === undefined || vol.resource === undefined) {
                cm.emptyDir = {};
                return cm;
              }

              if (vol.type == FeatureHubVolumeType.Secret) {
                cm.secret = {
                  secretName: vol.resource.name,
                  items: this._volumeItems(vol)
                };
              } else if (vol.type == FeatureHubVolumeType.ConfigMap) {
                cm.configMap = {
                  name: vol.resource.name,
                  items: this._volumeItems(vol)
                };
              } else if (vol.type == FeatureHubVolumeType.Pvc && vol.pvcName != null) {
                cm.persistentVolumeClaim = {
                  claimName: vol.resource.name,
                }
              }

              return cm;
            })
          },
        },
      },
    }, {parent: this});
  }

  private _getContainer(name: string, args: ServiceDeploymentArgs): k8stypes.core.v1.Container {
    return {
      name,
      image: args.image,
      resources: args.resources || {requests: {cpu: "300m", memory: "300Mi"}},
      
      command: args.command,
      env: args.env?.map(e => {
        return {name: e.name, value: e.value}
      }),
      volumeMounts: args.volumeNames?.map(vn => {
        const vol = args.volumes?.find(v => v.name == vn);
        if (vol === undefined) {
          return undefined;
        }
        const vm: k8stypes.core.v1.VolumeMount = {
          name: (vol.type == FeatureHubVolumeType.Pvc && vol.pvcName != null) ? (vol.pvcName as Volume).name : vn,
          mountPath: vol?.mountPath
        };
        return vm;
      }).filter(vm => vm !== undefined) as pulumi.Input<pulumi.Input<inputs.core.v1.VolumeMount>[]>,
      ports: args.ports && args.ports.map(p => ({containerPort: p.port})),
      livenessProbe: this._probe(args.healthCheck),
      readinessProbe: this._probe(args.healthCheck)
    };
  }

  private _probe(probe?: HealthCheck): pulumi.Input<inputs.core.v1.Probe> | undefined {
    if (probe === undefined) {
      return undefined;
    }

    return {
      httpGet: { path: probe.path || '/', port: probe.port },
      initialDelaySeconds: probe.initialDelaySeconds || 10,
      timeoutSeconds: probe.timeoutSeconds || 5
    };
  }

  private _volumeItems(vol: FeatureHubVolume): pulumi.Input<pulumi.Input<inputs.core.v1.KeyToPath>[]> {
    const data: pulumi.Input<pulumi.Input<inputs.core.v1.KeyToPath>[]> = vol.items.map(v => {return {
      key: v.name,
      path: v.name
    }});

    return data;
  }
}

export interface EnvPair {
    name: string;
    value: string;
}

export interface HealthCheck {
  port: number;
  // tcp?: boolean; // false by default
  path?: string; // /
  initialDelaySeconds?: number; // 10
  timeoutSeconds?: number; // 5
}

export interface Port {
  name?: string; // required if more than 1
  port: number;
  targetPort?: number; // same as port
}

export interface ServiceDeploymentArgs {
  image: string;
  resources?: k8stypes.core.v1.ResourceRequirements;
  volumes?: FeatureHubVolume[]; // holds all volumes that were loaded
  volumeNames?: string[]; // holds the list of the ones to mount here from the volumes list
  replicas?: number;
  ports?: Port[];
  allocateIpAddress?: boolean;
  isMinikube?: boolean;
  env?: EnvPair[];
  strategy?: DeploymentStrategy;
  command?: string[],
  healthCheck?: HealthCheck;
}