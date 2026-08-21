---
title: "Five Common Relationships Among Three Variables in Statistics"
type: post
date: 2026-08-15
displayDate: "2026"
authors:
  - Ahmed Azeez
categories:
  - Statistics
tags:
  - Statistics
  - Regression
  - Data Analysis
  - Research Methods
thumbnail: "diagram.png"
imageAlt: "Five common relationships among three variables in a statistical model"
description: "An original summary of five ways a third variable can relate to a predictor and response, attributed to Eric Cai and linked to the original sources."
slug: "five-common-relationships-among-three-variables-in-statistics"
---

## Why a third variable matters

A statistical model often begins with a predictor, **X**, and a response, **Y**. Adding a third variable, **Z**, can change how the relationship between X and Y should be interpreted. The important question is not only whether Z is included in the model, but also what role it plays in relation to the other variables.

The framework below is an original summary based on a statistics explainer by **Eric Cai**, who in turn points readers to Karen Grace-Martin’s detailed discussion at The Analysis Factor. It is presented here as a concise guide, not as a reproduction of the original article.

## Five possible roles for Z

### 1. Z is a covariate correlated with X

Z is associated with X and is also related to Y. Because X and Z move together, including both in a model may change the estimated relationship between the predictor and response. The strength of their association and the research question determine how the model should be specified.

### 2. Z is a covariate independent of X

Z is not associated with X but is related to Y. In this situation, Z may still improve the model’s explanation or precision even though it does not overlap with the predictor. It is therefore useful to distinguish independence from irrelevance.

### 3. Z is a confounding variable

Z influences, or is associated with, both X and Y. This can create a misleading or spurious relationship between X and Y if Z is not considered. Confounding is an interpretation problem: the apparent predictor–response relationship may partly reflect the third variable.

### 4. Z is a mediating variable

X is related to Z, and Z is then related to Y. Here, Z represents part of a possible pathway through which X is associated with Y. Mediation analysis can ask whether the relationship is partly or fully transmitted through Z, although causal interpretation requires an appropriate design and assumptions.

### 5. Z is a moderating variable

Z changes the strength or direction of the relationship between X and Y. This is commonly represented with an interaction term in a statistical model. The effect of X therefore depends on the level or category of Z rather than remaining constant across all observations.

## Why the distinction matters

The same variable can play different roles in different research questions. A covariate, confounder, mediator, and moderator should not be treated as interchangeable labels. Before fitting a model, it is important to decide whether the goal is prediction, explanation, adjustment, or causal interpretation, and then choose a specification that matches that goal.

## Attribution and original sources

This post is an original summary based on **Eric Cai’s** explainer, [“How can 3 variables to relate to each other in statistics?”](https://thedatacopywriter.substack.com/p/how-can-3-variables-to-relate-to). Eric Cai’s post credits **Karen Grace-Martin’s** article, [“Five Common Relationships Among Three Variables in a Statistical Model”](https://www.theanalysisfactor.com/five-common-relationships-among-three-variables-in-a-statistical-model/), which provides the longer explanation of the five relationships.

For the related distinction between moderation and interaction, see Eric Cai’s discussion of [association versus interaction in statistics](https://thedatacopywriter.substack.com/p/association-vs-interaction-in-statistics). The diagram accompanying this post is included with attribution to the source material shared by Eric Cai.

### References

1. [Eric Cai, “How can 3 variables to relate to each other in statistics?”](https://thedatacopywriter.substack.com/p/how-can-3-variables-to-relate-to)
2. [Karen Grace-Martin, “Five Common Relationships Among Three Variables in a Statistical Model”](https://www.theanalysisfactor.com/five-common-relationships-among-three-variables-in-a-statistical-model/)
3. [Eric Cai, “Association vs. Interaction in Statistics”](https://thedatacopywriter.substack.com/p/association-vs-interaction-in-statistics)
