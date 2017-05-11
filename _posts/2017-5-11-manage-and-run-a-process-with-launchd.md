---
layout: post
title:  مدیریت و اجرای یک process به کمک launchd در سیستم عامل macos
pdate: 1396-2-21
author: arastu
tags: macos process launchd systemd upstart sysvinit
---

معمولا در سیستم‌های شبه یونیکس و تقریبا همه سیستم عامل‌ها برای مدیریت، راه‌اندازی و توقف اجرای یک process، سرویس یا اسکریپت در سیستم عامل از ابزارهای به نام operating system service management استفاده می‌شود.

مثالهایی از این ابزارها در سیستم عامل‌های مختلف در لیست زیر آماده است:

+ سیستم عامل ویندوز: [Service Control Manager](https://en.wikipedia.org/wiki/Service_Control_Manager)
+ سیتم عامل Mac Os اپل: [launchd](https://en.wikipedia.org/wiki/Launchd)
+ سیستم عامل کروم گوگل: [Upstart](https://en.wikipedia.org/wiki/Upstart)
+ بسیاری از توزیع‌های لینوکس: [systemd](https://en.wikipedia.org/wiki/Systemd)
+ سولاریس: [Service Management Facility](https://en.wikipedia.org/wiki/Service_Management_Facility)
+ اندروید: [Android init](http://elinux.org/Android_Booting#.27init.27)
+ سیستم عامل‌های شبه یونیکس قدیمی: [sysvinit](https://en.wikipedia.org/wiki/Sysvinit)
+ جنتو: [OpenRC](https://en.wikipedia.org/wiki/OpenRC)

به زبان ساده‌تر همه این سیستم‌ها کمک می‌کنند  process ها  برای مدت طولانی  بدون نیاز به ما اجزا شوند و در صورت ریستارت شدن ماشین و بقیه مشکلات خود بخود دوباره اجرا شوند. با توجه به اینکه این processها برای مدت طولانی به حال خود رها می‌شوند باید Log و Error های خود را در جایی(مثلا فایل) ذخیره کنند تا در هنگام بروز مشکلات و یا برای بررسی صحت اجرای آن پروسس به آن مراجعه کنیم. این سیستم‌ها همه این کارها را انجام می‌دهند و با داشتن ابزارهایی برای کنترل و مانیتور کردن processها به ما کمک بسیاری می‌کنند.

شیوه کارکرد اکثر این ابزارها بدین صورت است که شما در یک فایل process خود را توصیف می‌کنید. توصیف می‌کنیم یعنی چیکار می‌کنیم؟ یعنی مثلا می‌گیم فایل اجرایی این process کجاست، لاگ‌ها و اررورها را در چه مسیری ذخیره کند. برای اجرای process چه آرگیومنت‌هایی هنگام اجرای process به آن بدهد. و هر کاری برای اجرای درست آن process لازم است.

در سیستم عامل مثلا :) شبه یونیکس مک هم ابزاری به نام launchd این کار را انجام می‌دهد.در این نوشته ما می‌خواهیم اجرای یک process فرضی به نام crushanalyzer که ابزاری است که به طور مرتب شبکه‌های اجتماعی را برای رصد کردن فعالیت‌های کراش شما و اطلاع دادن آنها به شما پایش می‌کند را به ابزار launchd بسپاریم تا خود را از دردسر‌های اجرا و مدیریت آن رها کنیم.

فرض کنید این ابزار را شما با زبان  c++ در مسیر ```$HOME/Workspace/crushanalyzer``` ایجاد کرده اید. بعد از کامپایل شدن خروجی این کد یک فایل باینری به نام crushfinderd در همین مسیر است. شما معمولا برای اینکه راحت باشید و به اصطاح این فایل در $PATH باشد معمولا بعد از کامپایل آن را در مسیر```/usr/local/bin``` کپی می‌کنید و در ترمینال آن را به شکل زیر اجرا می‌کنید:

```bash
export TWITTER_TOKEN="mdjnfh89therbge9urtye9rht95ty3840ty3890ty3"
export FACEBOOK_TOKEN="kdjhfsldhfaildhfsdlfhsjkfhsjkadfhaowiruyt48yeuryw984yr"
export INSTAGRAM_TOKEN="kejhrohio4uy5384953ty98nto389yt9v235ty59tby4958by49"
crushfinder start --config $HOME/.crushfinder.yaml --interval 40 --alert sms
```

وقتی این کد را اجرا می‌کنید لاگ و خروجی و اررور‌های این process را در ترمینال می‌بینید. اگر ترمینال را ببندید یا «مک بوک پرو ۲۰۱۶ اسپیس گریتان» ریستارت شود یا حتی خود این پروسس کرش کند مجبورید همه این مراحل را دوباره انجام دهید.
اینجاست که ابزار launchd به دادتان می‌رسد شما توضیحاتتان و روش اجرای این پروسه را به launchd می‌دهید و این موجود خودش مانند پلیس فتا حواسش به همه چی و همه جا هست و اجرای درست آن را کنترل می‌کند.

برای تعریف مشخصات و روش اجرای پروژه باید یک فایل xml با پسوند plist ایجاد کنید و با یک سینتکس مشخص مشخصات پروسس را در آن تعریف کنید.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ir.arastu.crushanalyzer</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>TWITTER_TOKEN</key>
        <string>mdjnfh89therbge9urtye9rht95ty3840ty3890ty3</string>
        <key>FACEBOOK_TOKEN</key>
        <string>kdjhfsldhfaildhfsdlfhsjkfhsjkadfhaowiruyt48yeuryw984yr</string>
        <key>INSTAGRAM_TOKEN</key>
        <string>kejhrohio4uy5384953ty98nto389yt9v235ty59tby4958by49</string>
    </dict>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/crushanalyzer</string>
        <string>start</string>
        <string>--config</string>
        <string>$HOME/.crushfinder.yaml</string>
        <string>--interval</string>
        <string>40</string>
        <string>--alert</string>
        <string>sms</string>
    </array>
    <key>StandardOutPath</key>
    <string>/tmp/crushfinder-stdout.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/crushfinder-stderr.log</string>
    <key>Debug</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>RunAtLoad</key>
	 <true/>
    <key>Disabled</key>
    <false/>
</dict>
</plist>
```

خب در این فایل Environment variableهای لازم و کامند لازم برای اجرای این process را به launchd معرفی کردیم. همانطور که مشاهده می‌کنید فایلهای مربوط به error و log را نیز به آن معرفی کردیم.
چیزهای اضافی تری نیز به launchd در این فایل توصیف داده ایم مثلا:

```
<key>KeepAlive</key>
<true/>
<key>RunAtLoad</key>
<true/>
```


این خطوط به launchd می‌فهماند که این process را بعد از هر اتفاقی که منجر به از کار افتادن آن شد دوباره راه اندازی کند و همینطور در ابتدای راه اندازی سیستم عامل نیز آن را راه اندازی کند.

برای اینکه launchd کنترل این process که در فایل plist توصیف شد را به دست بگیرد از ابزار launchctl در مک استفاده می‌شود. ابتدا این فایل را در مسیر ```$HOME/Library/LaunchAgents``` کپی کنید و سپس برای اجرای آن دستور زیر را در کامند لاین مک بزنید:
```bash
launchctl load $HOME/Library/LaunchAgents/ir.arastu.crushanalyzer.plist
```

اگر همه چیز به درستی پیش رفته باشد با زدن دستور ```launchctl list``` باید این process را در لیست پراسس‌های فعلی ببینید، خروجی چیزی شبیه به این خواهد بود:
```bash
363	0	ir.arastu.crushanalyzer
387	0	homebrew.mxcl.persiancalendar
327	0	com.apple.Spotlight
346	0	com.apple.soagent
528	0	com.apple.accessibility.mediaaccessibilityd
```

صفر به معنای موفقیت آمیز بودن شروع اجرای این process خواهد بود.
در اکثر operating system service management کار به همین شیوه و سبک انجام می‌شود اگر چه ممکن است دستورات و فرمت توصیف process متفاوت باشد.

امیدوارم از این نوشته لذت برده باشید.


نوشته شده با ویرایشگر [مرتب](http://www.sobhe.ir/moratab/)
