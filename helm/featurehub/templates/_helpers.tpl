{{/*
Expand the name of the chart.
*/}}
{{- define "featurehub.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "featurehub.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

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
{{- printf "%s-%s" (include "featurehub.fullname" .) "management-repository" }}
{{- end }}
{{- define "featurehub.edge.name" -}}
{{- printf "%s-%s" (include "featurehub.fullname" .) "edge" }}
{{- end }}
{{- define "featurehub.dacha.name" -}}
{{- printf "%s-%s" (include "featurehub.fullname" .) "dacha" }}
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

{{/*
Create the name of the service account to use (management-repository)
*/}}
{{- define "featurehub.managementRepository.serviceAccountName" -}}
{{- if .Values.managementRepository.serviceAccount.create }}
{{- default (include "featurehub.managementRepository.name" .) .Values.managementRepository.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.managementRepository.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the service account to use (edge)
*/}}
{{- define "featurehub.edge.serviceAccountName" -}}
{{- if .Values.edge.serviceAccount.create }}
{{- default (include "featurehub.edge.name" .) .Values.edge.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.edge.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the service account to use (dacha)
*/}}
{{- define "featurehub.dacha.serviceAccountName" -}}
{{- if .Values.dacha.serviceAccount.create }}
{{- default (include "featurehub.dacha.name" .) .Values.dacha.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.dacha.serviceAccount.name }}
{{- end }}
{{- end }}
