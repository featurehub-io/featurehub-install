{{/*
Expand the name of the chart.
*/}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "featurehub.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "featurehub.managementRepository.labels" -}}
helm.sh/chart: {{ include "featurehub.chart" . }}
{{ include "featurehub.managementRepository.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "featurehub.edge.labels" -}}
helm.sh/chart: {{ include "featurehub.chart" . }}
{{ include "featurehub.edge.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "featurehub.dacha.labels" -}}
helm.sh/chart: {{ include "featurehub.chart" . }}
{{ include "featurehub.dacha.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}


{{- define "featurehub.managementRepository.name" -}}
{{- default (.Values.managementRepository.name) "management-repository" }}
{{- end }}
{{- define "featurehub.edge.name" -}}
{{- default (.Values.managementRepository.name) "edge" }}
{{- end }}
{{- define "featurehub.dacha.name" -}}
{{- default (.Values.managementRepository.name) "dacha" }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "featurehub.managementRepository.selectorLabels" -}}
app.kubernetes.io/name: {{ include "featurehub.managementRepository.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{- define "featurehub.edge.selectorLabels" -}}
app.kubernetes.io/name: {{ include "featurehub.edge.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{- define "featurehub.dacha.selectorLabels" -}}
app.kubernetes.io/name: {{ include "featurehub.dacha.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "featurehub.fullname" -}}
{{- default (.Chart.Name) .Values.fullnameOverride }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "featurehub.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "featurehub.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
