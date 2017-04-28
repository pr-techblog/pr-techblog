---
layout: post
title:  فرار از جهنم Callback با تبدیل Callback به Promise
pdate: 1396-2-7
author: farzad
tags: javascript جاوااسکریپت callback promise
---

برای کار با توابع Async در جاوااسکریپت، از کالبک (Callback) استفاده میشه. با اینکه این راه در خیلی از موارد ممکنه مشکل رو حل کنه، زمانی که به انجام چند عمل Async باهم و در ادامه هم میرسیم، استفاده از Callback ما رو درگیر مشکلی به اسم __جهنم Callback__ `Callback Hell` میکنه. برای حل این مشکل خوبه که بدونیم میشه Callback ها رو تبدیل به Promise کرد.

## نوشتن تبدیل

برای اینکه بدونیم چطور میشه Callback رو به Promise تبدیل کرد، باید بدونیم Promise چه خصوصیاتی داره. نمیخوام وارد جزییات تعریفش بشم. اگر نمیدونین Promise چیه میتونین به
[تعریف پرامیس](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise "پرامیس چیه"){:target="_blank"}
مراجعه کنین.

برای سادگی نشون دادن این تبدیل بیایم یه عمل Async ساده رو درنظر بگیریم و باهم از حالت کالبک، به پرامیس تبدیلش کنیم.
برای مثال در استفاده از فایل سیستم در Nodejs، تابعی وجود داره به اسم `fs.readFile` که خیلی ساده میتونین با استفاده ازش، محتویات یه فایل در فایل سیستم رو بخونید. متناظر با این تابع، `fs.writeFile` هم وجود داره که میتونید با استفاده ازش یه محتوایی رو توی یه فایل ذخیره کنید.
فرض کنید دو فایل داریم توی فولدر _files_ پروژه با نام های:
* read.txt
* write.txt

و میخوایم محتویات فایل _read.txt_ رو بخونیم و توی فایل _write.txt_ ذخیره کنیم. به صورت پیش فرض در Nodejs همه عملیات Async هستن (این برمیگرده به ذات None-blocking-IO) و پارامتری رو به عنوان کالبک دریافت میکنن. کد زیر رو ببینید:

{% highlight javascript %}
// Basic variables
const filesBaseDir = __dirname + '/files'
const filesDir = {
  read: filesBaseDir + '/read.txt',
  write: filesBaseDir + '/write.txt'
}
const fs = require('fs')

// Utils
const readFile = (fileDir, success, fail) => {
  fs.readFile(fileDir, (err, data) => {
    if (err) return fail(err)
    
    return success(data)
  })
}
const writeFile = (fileDir, content, success, fail) => {
  fs.writeFile(fileDir, content, (err) => {
    if (err) return fail(err)

    return success()
  })
}
{% endhighlight %}

حالا با درنظر داشتن کد بالا عملیات مدنظر رو انجام میدیم:

{% highlight javascript %}
readFile(filesDir.read, (data) => {
  // Now write data to write.txt
  writeFile(filesDir.write, data, () => {
    console.log('Mission accomplished!')
  }, (err) => {
    console.error('Error writing to file...)
  })
}, (err) => {
  console.error('Error reading file...')
})
{% endhighlight %}
 
خب به خوبی و خوشی تونستیم دو تابع Async رو باهم ادغام کنیم و زنجیره وار ازشون استفاده کنیم. تا همینجاش وقتی حتی فقط __2__ تابع Async وجود داشت، دردسر زیادی برای ادغامشون کشیدیم، حالا اگر قرار بود ۴تا یا حتی ۱۰تا عمل Async رو پشت هم و در ادامه هم انجام میدادیم چطور؟ ۱۰ عمل Async در ادامه هم یعنی فراخوانی __9__ کالبک در کالبک قبلی!! اسم دیگه ای به جز جهنم نمیشه براش گذاشت!

برای رهایی ازین شرایط کافیه بدونیم میتونیم توابع Async ای که کالبک میپذیرن رو به Promise تبدیل کنیم. ممکنه در وهله اول این تبدیل ارزش چندانی براتون نداشته باشه، اما اجازه بدین نشونتون بدم چطور زندگی براتون ساده تر میشه وقتی از جهنم میاین بیرون :))

## نوشتن دوباره با استفاده از Promise ها

همون فانکشن های قبلی رو اینبار با استفاده از پرامیس مینویسیم:

{% highlight javascript %}
// Convert Callbacks to Promisified version
const promisifiedReadFile = (fileDir) => {
  return new Promise((resolve, reject) => {
    readFile(fileDir, (data) => resolve(data), (e) => reject(e))
  })
}
const promisifiedWriteFile = (fileDir, data) => {
  return new Promise((resolve, reject) => {
    writeFile(fileDir, data, () => resolve(), (e) => reject(e))
  })
}
{% endhighlight %}

حالا از ورژن Promisified استفاده میکنیم:

{% highlight javascript %}
promisifiedReadFile(filesDir.read)
  .then((data) => promisifiedWriteFile(filesDir.write, data))
  .then(() => {
    console.log('Mission accomplished!')
  })
  .catch(e => console.error('Error'))
{% endhighlight %}

خاصیت پرامیس ها اینه که به تعداد نامحدود هم اگر باشن میشه به راحتی در قالب `.then` های پشت هم ازشون استفاده کرد. پرامیس مثل بلاک `try-catch` عمل میکنه، به این معنی که نیازی نیس برای هر _.then_ یه _.catch_ قرار بدیم درحالیکه کافیه Exception رو در هر جایی از این زنجیره return کنیم و فقط یه .catch در انتهای زنجیره قرار بدیم تا بتونه این Exception رو بگیره. 

اگر هم براتون واقعا مهمه :پوکرفیس که بدونین کجای پروسه به مشکل خوردین، منظورم نوع اروریه که توی پروسه اتفاق میوفته، کافیه نوع ارور خاص خودتون رو بسازید تا با استفاده از اون بتونید نوع مشکل پیش اومده رو پیش بینی کنید:

{% highlight javascript %}
class ReadError extends Error {}
class WriteError extends Error {}
{% endhighlight %}

و در نهایت توی توابع مربوطه ارور مناسبش رو return کنین تا توسط catch انتهای زنجیره گرفته بشه.


{% highlight javascript %}
const readFile = (fileDir, success, fail) => {
  fs.readFile(fileDir, (err, data) => {
    if (err) return new ReadError(err)
    
    return success(data)
  })
}
const writeFile = (fileDir, content, success, fail) => {
  fs.writeFile(fileDir, content, (err) => {
    if (err) return new WriteError(err)

    return success()
  })
}
{% endhighlight %}

## در نهایت اینکه (Rule of Thumb)

برای تبدیل هر کالبک به پرامیس کافیه یه تابع ساخته بشه که یه پروامیس برگردونه. هم چنین این پرامیس دو تابع resolve و reject به عنوتن پارامتر دریافت کنه. توی بدنه این تابع، اون تابع کالبک دار اولیه رو فراخونی کنین و موقعی که ارور ندارید، resolve رو صدا کنین و موقعی که به ارور میخوره reject کنین. همین!

مطمئن باشید زندگی با Promise خیلی ساده تر از کالبکه به خصوص زمانی که بخواین زنجیری از کالبک ها رو صدا کنید!

هم چنین اگر از Nodejs استفاده میکنین پیشنهاد میکنم از پکیج __es6-promisify__ استفاده کنید و توابع Callback دار نود جی اس رو به پرامیس تبدیل کنید.

---

خوشحال میشم ایده هاتون رو در مورد این مطلب توی کامنت ها ببینم تا فیبدک هامون رو به هم منتقل کنیم.
اگر از خوندن این مطلب لذت بردین میتونین اونو با دیگران به اشتراک بزارید. همینطور میتونین از سایر مطالب بلاگ هم استفاده کنین و یا اگر دوس داشته باشید، کنارمون بنویسید. برای راهنمای انتشار مطلب در پول ریکوئست میتونین
[از این لینک](http://pullrequest.ir/contribute "راهنمای انتشار مطلب در پول ریکوئست") استفاده کنین.
