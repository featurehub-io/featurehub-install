# featurehub

![Version: 3.0.0](https://img.shields.io/badge/Version-3.0.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.5.6](https://img.shields.io/badge/AppVersion-1.5.6-informational?style=flat-square)

FeatureHub Release

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| https://charts.bitnami.com/bitnami | postgresql | 11.0.5 |
| https://nats-io.github.io/k8s/helm/charts/ | nats | 0.13.1 |

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| dacha.affinity | object | `{}` |  |
| dacha.enabled | bool | `true` |  |
| dacha.envAsAppConfigFile | bool | `true` | If `true`, entries from `environmentVars` and `envFromSecret` fields will be mapped to configuration files. `environmentVars` to /etc/app-config/application.properties `envFromSecret` to /etc/app-config/secrets.properties Used for retrocompatiblity with FeatureHub controller versions lower than 1.5.0 https://docs.featurehub.io/installation.html#_run_configuration |
| dacha.envFromSecret | string | `""` | Name of the secret containing secret properties, to be exposed as environment variables to dacha deployment. Create the secret in advance, then reference it here. As of 1.5.0 all FeatureHub controller properties are available as environment variables using the same case Entries of the secret specified here are the same as would be specified in /etc/app-config/secrets.properties |
| dacha.environmentVars | object | `{"cache.pool-size":"10"}` | Environment variables to be exposed to dacha deployment. As of 1.5.0 all FeatureHub controller properties are available as environment variables using the same case. Entries accepted here are the same as would be specified in /etc/app-config/applications.properties. Note that `server.port` and `monitor.port` use their default values of `8085` and `8701` respectively, to make it easier to implement the deployment, service and the prometheus serviceMonitor manifests. |
| dacha.extraContainers | list | `[]` | List of extra containers to add to Dacha Pod |
| dacha.extraEnvironmentVars | object | `{}` | Extra environment variables to be exposed to dacha deployment. In terms of environment variable setting, this is the same as `environmentVars` field. The only difference is that if `envAsAppConfigFile: true`, only entries from `environmentVars` will be mapped to the application.properties configuration file, and not the ones from `extraEnvironmentVars`. |
| dacha.extraVolumeMounts | list | `[]` | List of extra mounts to add to Dacha Deployment |
| dacha.extraVolumes | list | `[]` | List of extra volumes to add to Dacha Deployment |
| dacha.image.repository | string | `"featurehub/dacha"` |  |
| dacha.image.tag | string | `"1.5.6"` |  |
| dacha.imagePullSecrets | list | `[]` |  |
| dacha.ingress.annotations | object | `{}` |  |
| dacha.ingress.className | string | `""` |  |
| dacha.ingress.enabled | bool | `false` |  |
| dacha.ingress.hosts | list | `[]` |  |
| dacha.ingress.tls | list | `[]` |  |
| dacha.nodeSelector | object | `{}` |  |
| dacha.podAnnotations | object | `{}` |  |
| dacha.podSecurityContext.fsGroup | int | `999` |  |
| dacha.prometheus | object | `{"enabled":false,"labels":{}}` | Prometheus configuration |
| dacha.prometheus.enabled | bool | `false` | Whether to enable or disable prometheus metrics endpoints, and serviceMonitor If enabled, metrics are exposed on port 8701, on /metrics endpoint |
| dacha.prometheus.labels | object | `{}` | Labels for the Prometheus Operator to handle the serviceMonitor |
| dacha.pullPolicy | string | `"IfNotPresent"` |  |
| dacha.replicaCount | int | `2` |  |
| dacha.resources | object | `{}` |  |
| dacha.securityContext.runAsNonRoot | bool | `true` |  |
| dacha.securityContext.runAsUser | int | `999` |  |
| dacha.serviceAccount.annotations | object | `{}` |  |
| dacha.serviceAccount.create | bool | `true` |  |
| dacha.serviceAccount.name | string | `""` |  |
| dacha.strategy | object | `{}` |  |
| dacha.tolerations | list | `[]` |  |
| edge.affinity | object | `{}` |  |
| edge.enabled | bool | `true` |  |
| edge.envAsAppConfigFile | bool | `true` | If `true`, entries from `environmentVars` and `envFromSecret` fields will be mapped to configuration files. `environmentVars` to /etc/app-config/application.properties `envFromSecret` to /etc/app-config/secrets.properties Used for retrocompatiblity with FeatureHub controller versions lower than 1.5.0 https://docs.featurehub.io/installation.html#_run_configuration |
| edge.envFromSecret | string | `""` | Name of the secret containing secret properties, to be exposed as environment variables to edge deployment. Create the secret in advance, then reference it here. As of 1.5.0 all FeatureHub controller properties are available as environment variables using the same case Entries of the secret specified here are the same as would be specified in /etc/app-config/secrets.properties |
| edge.environmentVars | object | `{"dacha.url.default":"http://featurehub-dacha","listen.pool-size":"30","maxSlots":"30","server.gracePeriodInSeconds":"10","update.pool-size":"30"}` | Environment variables to be exposed to edge deployment. As of 1.5.0 all FeatureHub controller properties are available as environment variables using the same case. Entries accepted here are the same as would be specified in /etc/app-config/applications.properties. Note that `server.port` and `monitor.port` use their default values of `8085` and `8701` respectively, to make it easier to implement the deployment, service and the prometheus serviceMonitor manifests. |
| edge.extraContainers | list | `[]` | List of extra containers to add to Edge Pod |
| edge.extraEnvironmentVars | object | `{}` | Extra environment variables to be exposed to edge deployment. In terms of environment variable setting, this is the same as `environmentVars` field. The only difference is that if `envAsAppConfigFile: true`, only entries from `environmentVars` will be mapped to the application.properties configuration file, and not the ones from `extraEnvironmentVars`. |
| edge.extraVolumeMounts | list | `[]` | List of extra mounts to add to Edge Deployment |
| edge.extraVolumes | list | `[]` | List of extra volumes to add to Edge Deployment |
| edge.image.repository | string | `"featurehub/edge"` |  |
| edge.image.tag | string | `"1.5.6"` |  |
| edge.imagePullSecrets | list | `[]` |  |
| edge.ingress.annotations | object | `{}` |  |
| edge.ingress.className | string | `""` |  |
| edge.ingress.enabled | bool | `false` |  |
| edge.ingress.hosts | list | `[]` |  |
| edge.ingress.tls | list | `[]` |  |
| edge.nodeSelector | object | `{}` |  |
| edge.podAnnotations | object | `{}` |  |
| edge.podSecurityContext.fsGroup | int | `999` |  |
| edge.prometheus | object | `{"enabled":false,"labels":{}}` | Prometheus configuration |
| edge.prometheus.enabled | bool | `false` | Whether to enable or disable prometheus metrics endpoints, and serviceMonitor If enabled, metrics are exposed on port 8701, on /metrics endpoint |
| edge.prometheus.labels | object | `{}` | Labels for the Prometheus Operator to handle the serviceMonitor |
| edge.pullPolicy | string | `"IfNotPresent"` |  |
| edge.replicaCount | int | `2` |  |
| edge.resources | object | `{}` |  |
| edge.securityContext.runAsNonRoot | bool | `true` |  |
| edge.securityContext.runAsUser | int | `999` |  |
| edge.serviceAccount.annotations | object | `{}` |  |
| edge.serviceAccount.create | bool | `true` |  |
| edge.serviceAccount.name | string | `""` |  |
| edge.strategy | object | `{}` |  |
| edge.tolerations | list | `[]` |  |
| fullnameOverride | string | `""` |  |
| global.envAsApplicationProperties | bool | `true` | If `true`, entries from `environmentVars` will be mapped to /etc/app-config/common.properties file To mount secret settings as /etc/app-config/common.properties see volume fields Used for retrocompatiblity with FeatureHub controller versions lower than 1.5.0 https://docs.featurehub.io/installation.html#_run_configuration |
| global.environmentVars | string | `nil` | Environment variables to be exposed to Management Repository, Edge and Dacha deployments. As of 1.5.0 all FeatureHub controller properties are available as environment variables using the same case. Entries accepted here are the same as would be specified in /etc/app-config/common.properties. |
| global.extraCommonConfigFiles[0].configMapSuffix | string | `"log4j2-xml"` |  |
| global.extraCommonConfigFiles[0].content | string | `"<Configuration packages=\"cd.connect.logging\" monitorInterval=\"30\" verbose=\"true\">\n   <Appenders>\n     <Console name=\"STDOUT\" target=\"SYSTEM_OUT\">\n       <ConnectJsonLayout/>\n     </Console>\n   </Appenders>\n\n   <Loggers>\n     <AsyncLogger name=\"io.featurehub\" level=\"debug\"/>\n     <!--\n     <AsyncLogger name=\"io.ebean.SQL\" level=\"trace\"/>\n     <AsyncLogger name=\"io.ebean.TXN\" level=\"trace\"/>\n     <AsyncLogger name=\"io.ebean.SUM\" level=\"trace\"/>\n     <AsyncLogger name=\"io.ebean.DDL\" level=\"trace\"/>\n     <AsyncLogger name=\"io.ebean.cache.QUERY\" level=\"trace\"/>\n     <AsyncLogger name=\"io.ebean.cache.BEAN\" level=\"trace\"/>\n     <AsyncLogger name=\"io.ebean.cache.COLL\" level=\"trace\"/>\n     <AsyncLogger name=\"io.ebean.cache.NATKEY\" level=\"trace\"/>\n\n     <AsyncLogger name=\"jersey-logging\" level=\"trace\"/>\n     <AsyncLogger name=\"io.featurehub.db\" level=\"trace\"/>\n     -->\n     <AsyncLogger name=\"io.featurehub.edge.features\" level=\"debug\"/>\n\n   <AsyncLogger name=\"net.stickycode\" level=\"warn\"/>\n   <AsyncLogger name=\"org.glassfish.jersey.server.wadl\" level=\"error\"/>\n   <AsyncLogger name=\"io.avaje.config\"  level=\"warn\"/>\n   <AsyncLogger name=\"org.hibernate\" level=\"error\"/>\n\n\n   <AsyncRoot level=\"info\">\n       <AppenderRef ref=\"STDOUT\"/>\n     </AsyncRoot>\n   </Loggers>\n</Configuration>"` |  |
| global.extraCommonConfigFiles[0].fileName | string | `"log4j2.xml"` |  |
| global.extraEnvironmentVars | object | `{}` | Extra environment variables to be exposed to Management Repository, Edge and Dacha deployments. In terms of environment variable setting, this is the same as `environmentVars` field. The only difference is that if `envAsAppConfigFile: true`, only entries from `environmentVars` will be mapped to the common.properties configuration file, and not the ones from `extraEnvironmentVars`. |
| global.extraVolumeMounts | list | `[]` | List of extra mounts to add to Management Repository Deployment |
| global.extraVolumes | list | `[]` | List of extra volumes to add to Management Repository Deployment |
| managementRepository.affinity | object | `{}` |  |
| managementRepository.enabled | bool | `true` |  |
| managementRepository.envAsApplicationProperties | bool | `false` | If `true`, entries from `environmentVars` will be mapped to /etc/app-config/application.properties file To mount secret settings as /etc/app-config/application.properties see volume fields Used for retrocompatiblity with FeatureHub controller versions lower than 1.5.0 https://docs.featurehub.io/installation.html#_run_configuration |
| managementRepository.envFromSecret | string | `""` | Name of the secret containing secret properties, to be exposed as environment variables to edge deployment. Create the secret in advance, then reference it here. As of 1.5.0 all FeatureHub controller properties are available as environment variables using the same case Entries of the secret specified here are the same as would be specified in /etc/app-config/secrets.properties |
| managementRepository.environmentVars | object | `{"db.connections":"3","db.url":"jdbc:postgresql://setmeup-postgresql-endpoint:5432/featurehub","db.username":"featurehub","portfolio.admin.group.suffix":"Administrators","register.url":"http://localhost/register-url?token=%s","run.nginx":"true","server.gracePeriodInSeconds":"10"}` | Environment variables to be exposed to management-repository deployment. As of 1.5.0 all FeatureHub controller properties are available as environment variables using the same case. Entries accepted here are the same as would be specified in /etc/app-config/applications.properties. Note that `server.port` and `monitor.port` use their default values of `8085` and `8701` respectively, to make it easier to implement the deployment, service and the prometheus serviceMonitor manifests. |
| managementRepository.extraContainers | list | `[]` | List of extra containers to add to Management Repository Pod |
| managementRepository.extraEnvironmentVars | object | `{}` | Extra environment variables to be exposed to management-repository deployment. In terms of environment variable setting, this is the same as `environmentVars` field. The only difference is that if `envAsAppConfigFile: true`, only entries from `environmentVars` will be mapped to the application.properties configuration file, and not the ones from `extraEnvironmentVars`. |
| managementRepository.extraVolumeMounts | list | `[]` | List of extra mounts to add to Management Repository Deployment |
| managementRepository.extraVolumes | list | `[]` | List of extra volumes to add to Management Repository Deployment |
| managementRepository.image.repository | string | `"featurehub/mr"` |  |
| managementRepository.image.tag | string | `"1.5.6"` |  |
| managementRepository.imagePullSecrets | list | `[]` |  |
| managementRepository.ingress.annotations | object | `{}` |  |
| managementRepository.ingress.className | string | `""` |  |
| managementRepository.ingress.enabled | bool | `false` |  |
| managementRepository.ingress.hosts | list | `[]` |  |
| managementRepository.ingress.tls | list | `[]` |  |
| managementRepository.nodeSelector | object | `{}` |  |
| managementRepository.podAnnotations | object | `{}` |  |
| managementRepository.podSecurityContext.fsGroup | int | `999` |  |
| managementRepository.prometheus | object | `{"enabled":false,"labels":{}}` | Prometheus configuration |
| managementRepository.prometheus.enabled | bool | `false` | Whether to enable or disable prometheus metrics endpoints, and serviceMonitor If enabled, metrics are exposed on port 8701, on /metrics endpoint |
| managementRepository.prometheus.labels | object | `{}` | Labels for the Prometheus Operator to handle the serviceMonitor |
| managementRepository.pullPolicy | string | `"IfNotPresent"` |  |
| managementRepository.replicaCount | int | `1` |  |
| managementRepository.resources | object | `{}` |  |
| managementRepository.securityContext.runAsNonRoot | bool | `true` |  |
| managementRepository.securityContext.runAsUser | int | `999` |  |
| managementRepository.serviceAccount.annotations | object | `{}` |  |
| managementRepository.serviceAccount.create | bool | `true` |  |
| managementRepository.serviceAccount.name | string | `""` |  |
| managementRepository.strategy | object | `{}` |  |
| managementRepository.tolerations | list | `[]` |  |
| nameOverride | string | `""` |  |
| nats | object | `{"cluster":{"enabled":true,"name":"featurehub","replicas":3},"enabled":true,"topologyKeys":[]}` | ----------------------------------------------------------------------------- # |
| postgresql | object | `{"enabled":false,"global":{"postgresql":{"auth":{"postgresPassword":"postgresql"}}},"primary":{"initdb":{"scripts":{"featurehub.sql":"CREATE USER featurehub PASSWORD 'featurehub'; CREATE DATABASE featurehub; GRANT ALL PRIVILEGES ON DATABASE featurehub TO featurehub;"}},"persistence":{"accessModes":["ReadWriteOnce"],"enabled":true,"size":"128Mi","storageClassName":"standard"}}}` | ----------------------------------------------------------------------------- # |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.6.0](https://github.com/norwoodj/helm-docs/releases/v1.6.0)
