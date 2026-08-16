---
title: "خمس علاقات شائعة بين ثلاثة متغيرات في الإحصاء"
type: post
date: 2026-08-15
displayDate: "2026"
slug: "five-common-relationships-among-three-variables-in-statistics"
authors:
  - Ahmed Azeez
categories:
  - الإحصاء
tags:
  - الإحصاء
  - الانحدار
  - تحليل البيانات
  - مناهج البحث
thumbnail: "diagram.png"
imageAlt: "خمس علاقات شائعة بين ثلاثة متغيرات في نموذج إحصائي"
description: "ملخص أصلي لخمس طرق يمكن أن يرتبط بها متغير ثالث بالمتنبئ والاستجابة، مع روابط إلى المصادر الأصلية."
---

## لماذا يهم المتغير الثالث؟

يبدأ النموذج الإحصائي غالباً بمتنبئ **X** واستجابة **Y**. ويمكن أن تؤدي إضافة متغير ثالث **Z** إلى تغيير طريقة تفسير العلاقة بين X وY. ولا يقتصر السؤال المهم على معرفة ما إذا كان Z موجوداً في النموذج، بل يشمل أيضاً الدور الذي يؤديه بالنسبة إلى المتغيرات الأخرى.

الإطار أدناه ملخص أصلي مبني على شرح إحصائي قدمه **Eric Cai**، والذي يحيل بدوره إلى مناقشة مفصلة لـ Karen Grace-Martin في The Analysis Factor. ويُقدَّم هنا كدليل موجز، وليس إعادة نشر للمقال الأصلي.

## خمسة أدوار محتملة للمتغير Z

### 1. متغير مشارك مرتبط بـ X

يرتبط Z بالمتغير X، كما يرتبط أيضاً بالمتغير Y. ولأن X وZ يتحركان معاً، فإن إدراجهما معاً في النموذج قد يغير العلاقة المقدّرة بين المتنبئ والاستجابة. ويعتمد تحديد النموذج على قوة الارتباط بينهما وعلى سؤال البحث.

### 2. متغير مشارك مستقل عن X

لا يرتبط Z بالمتغير X، لكنه يرتبط بالمتغير Y. وقد يحسّن Z تفسير النموذج أو دقته حتى لو لم يتداخل مع المتنبئ. لذلك من المفيد التمييز بين الاستقلال وعدم الأهمية.

### 3. متغير مربك

يؤثر Z في كل من X وY، أو يرتبط بهما معاً. وقد يؤدي عدم أخذ Z في الاعتبار إلى علاقة مضللة أو زائفة بين X وY. فالمشكلة هنا تتعلق بالتفسير، لأن العلاقة الظاهرة بين المتنبئ والاستجابة قد تعكس جزئياً أثر المتغير الثالث.

### 4. متغير وسيط

يرتبط X بالمتغير Z، ثم يرتبط Z بالمتغير Y. ويمثل Z هنا جزءاً من مسار محتمل ترتبط من خلاله X بـY. ويمكن لتحليل الوساطة أن يفحص ما إذا كانت العلاقة تنتقل جزئياً أو كلياً عبر Z، لكن التفسير السببي يتطلب تصميماً وافتراضات مناسبة.

### 5. متغير مُعدِّل

يغيّر Z قوة العلاقة بين X وY أو اتجاهها. وغالباً ما يُمثَّل ذلك بحد تفاعل في النموذج الإحصائي. وبذلك يعتمد أثر X على مستوى Z أو فئته، ولا يبقى ثابتاً في جميع المشاهدات.

## لماذا يهم هذا التمييز؟

قد يؤدي المتغير نفسه أدواراً مختلفة باختلاف سؤال البحث. ولا ينبغي التعامل مع المتغير المشارك والمتغير المربك والمتغير الوسيط والمتغير المعدّل على أنها تسميات متبادلة. وقبل ملاءمة النموذج، من المهم تحديد ما إذا كان الهدف هو التنبؤ أو التفسير أو الضبط أو الاستدلال السببي، ثم اختيار صياغة تتوافق مع ذلك الهدف.

## المصادر الأصلية

هذا المنشور ملخص أصلي مبني على شرح **Eric Cai** بعنوان [“How can 3 variables to relate to each other in statistics?”](https://thedatacopywriter.substack.com/p/how-can-3-variables-to-relate-to). ويشير منشور Eric Cai إلى مقال **Karen Grace-Martin** بعنوان [“Five Common Relationships Among Three Variables in a Statistical Model”](https://www.theanalysisfactor.com/five-common-relationships-among-three-variables-in-a-statistical-model/)، الذي يقدم شرحاً أطول للعلاقات الخمس.

وللتعرف على الفرق المرتبط بين التعديل والتفاعل، يمكن الرجوع إلى مناقشة Eric Cai حول [association versus interaction in statistics](https://thedatacopywriter.substack.com/p/association-vs-interaction-in-statistics). أما الرسم المرافق لهذا المنشور فهو مرفق مع الإشارة إلى المادة المصدرية التي شاركها Eric Cai.

### المراجع

1. [Eric Cai, “How can 3 variables to relate to each other in statistics?”](https://thedatacopywriter.substack.com/p/how-can-3-variables-to-relate-to)
2. [Karen Grace-Martin, “Five Common Relationships Among Three Variables in a Statistical Model”](https://www.theanalysisfactor.com/five-common-relationships-among-three-variables-in-a-statistical-model/)
3. [Eric Cai, “Association vs. Interaction in Statistics”](https://thedatacopywriter.substack.com/p/association-vs-interaction-in-statistics)
