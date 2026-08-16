---
title: "ROC Curves and AUC: Useful Measures, Not the Whole Story"
type: post
date: 2026-08-16
displayDate: "2026"
authors:
  - Ahmed Azeez
categories:
  - Public Health
tags:
  - Public Health
  - Epidemiology
  - Research Methods
  - Biostatistics
  - Data Interpretation
  - Predictive Modeling
  - Health Analytics
thumbnail: "thumbnail.png"
imageAlt: "ROC and AUC curve illustrating model discrimination"
description: "A practical explanation of what ROC curves and AUC measure, and why they should not be treated as complete evidence of model quality."
---

ROC curves and the area under the curve (AUC) are widely used when researchers evaluate a model that classifies people into two outcome groups. They are useful measures, but they are also easy to overinterpret.

The infographic below provides a visual overview of ROC curves, AUC, and the limits of interpreting discrimination as a complete measure of model quality.

{{< inline-image "roc-auc-infographic.png" "AUC and ROC curves infographic" >}}

## What does an ROC curve show?

A model often produces a probability or score rather than a simple yes-or-no answer. Changing the decision threshold changes the number of people identified as positive and the number missed. An ROC curve displays this trade-off across many possible thresholds.

The vertical axis represents **sensitivity**, or the proportion of people with the outcome who are correctly identified. The horizontal axis represents the **false-positive rate**, calculated as **1 − specificity**. Specificity is the proportion of people without the outcome who are correctly classified as negative.

In practical terms, the curve helps answer this question: how does the model’s ability to detect the outcome change when the classification threshold changes?

## What does AUC add?

AUC summarises the model’s discrimination across all thresholds. One useful interpretation is that it reflects how often the model assigns a higher predicted score to a randomly selected person with the outcome than to a randomly selected person without it.

An AUC close to 0.5 indicates discrimination that is not better than chance, while higher values generally indicate stronger separation between the two groups. However, an AUC is a summary of ranking or discrimination—not a complete verdict on the model.

## What a high AUC does not prove

A high AUC does not show that the model is causal. The predictors may help separate the groups without causing the outcome.

It also does not establish that the predicted probabilities are well calibrated. A model can rank people correctly while systematically overestimating or underestimating their actual risk.

AUC alone cannot tell us whether performance is consistent across demographic or clinical subgroups, whether the model is useful at a particular decision threshold, or whether using it would improve a public-health programme. Those questions require additional evaluation of calibration, fairness, clinical or operational utility, and the intended context of use.

## A public-health example

Imagine a population-health model designed to distinguish women with poor mental-health-related quality of life from those without that outcome. The model might use information about emotional problems, general health, fatigue, pain, age, and education.

The ROC curve would show how well the combined model separates the two outcome groups as the threshold changes. The AUC would provide a single summary of that separation. Neither result, by itself, would tell us whether any one predictor caused poor quality of life, whether the predictions are accurate for every subgroup, or whether the model is appropriate for making decisions about individual patients.

## The right interpretation

AUC helps answer one focused question: **How well does the model distinguish between groups?** It does not answer every question about whether the model is meaningful, equitable, calibrated, or appropriate for decision-making.

For that reason, ROC curves and AUC should be interpreted alongside the research question, the study population, the outcome definition, calibration results, subgroup performance, and the consequences of using the model. Good model evaluation is not about finding one impressive number; it is about understanding whether the model is fit for its intended purpose.

The topic and example were prompted by [Ria N. Gajar’s original LinkedIn post](https://lnkd.in/p/gPKjdw6T).

#PublicHealth #Epidemiology #ResearchMethods #Biostatistics #DataInterpretation #PredictiveModeling #HealthAnalytics
