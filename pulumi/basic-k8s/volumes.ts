import * as pulumi from "@pulumi/pulumi";
import { ConfigMap, ConfigMapArgs, Secret, SecretArgs } from '@pulumi/kubernetes/core/v1';
import { CustomResource, Input } from '@pulumi/pulumi';
import { core } from '@pulumi/kubernetes/types/input';
import Volume = core.v1.Volume;
import { output as outputs } from '@pulumi/kubernetes/types';

// we call our secrets and configmaps the same name as the entry inside them that maps their
// content
export class VolumeDeployments extends pulumi.ComponentResource {
  constructor(args: FeatureHubVolume[], opts?: pulumi.ComponentResourceOptions) {
    super("k8sjs:volume:VolumeDeployments", "featurehub-volumes", {}, opts);

    args
      .forEach(volume => {
        if (volume.type == FeatureHubVolumeType.Secret) {
          const secret: SecretArgs =
            {data: this._data(volume)};

          volume.resource = new Secret(volume.name, secret).metadata;
          // this.secrets.push();
        } else if (volume.type == FeatureHubVolumeType.ConfigMap) {
          const configMap: ConfigMapArgs = {
            data: this._data(volume)
          };

          volume.resource = new ConfigMap(volume.name, configMap).metadata;
        }
      });


  }

  private _data(volume: FeatureHubVolume): pulumi.Input<{[key: string]: pulumi.Input<string>; }> {
    const data: pulumi.Input<{[key: string]: pulumi.Input<string>; }> = {};

    volume.items.filter(v => v.content != null).forEach(v => {
      data[v.name] = volume.type == FeatureHubVolumeType.Secret ? Buffer.from(v.content || '').toString('base64') : (v.content || '');
    });

    return data;
  }
}

export interface FeatureHubVolumeItem {
  name: string;
  content?: string;
}

export enum FeatureHubVolumeType {
  ConfigMap,
  Secret,
  Pvc
}

export interface FeatureHubVolume {
  name: string;
  mountPath: string;
  type: FeatureHubVolumeType;
  resource?: pulumi.Output<outputs.meta.v1.ObjectMeta>;
  pvcName?: Input<Volume>;
  items: FeatureHubVolumeItem[]; // defaults to null, which means its already loaded
}
