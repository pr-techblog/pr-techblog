---
layout: post
title: مروری بر MySQL Triggers
pdate: 1397-02-31
author: mahmoud
tags: mysql database دیتابیس
---

![MySQL][mysql]

Trigger:

تریگرها به مجموعه‌ای از توابع/دستوراتی اطلاق میشه که با انجام کاری اجرا میشوند ، یعنی اگر تریگری داشته باشیم برای اجرا قبل از Insert در جدول X این تریگر هنگامیکه بخواهیم یک داده رو با کوئری Insert وارد جدولمون کنیم اجرا خواهد شد.
کار با تریگرها ساده ولی کاربردی هستند.
یک مثال کاربردی:
فرض میکنیم برای یک فروشگاه اینترنتی دیتابیسی رو میخواهیم طراحی کنیم که دارای 2 جدول برای ذخیره‌ی مشتری و اعتبارپنلش و دیگری برای نگهداری اطلاعات هر خرید مشتری باشد.
عملی که رخ میدهد به شرح زیر است:
هنگامیکه مشتری اقدام به خرید نمود مبلغ هر خرید از اعتبار کاربری مشتری کسر شود.

Customers

* id: شناسه مشتری
* name:نام مشتری
* credit:اعتبار مشتری

```
CREATE TABLE `customers` ( 
	 `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
	`name` VARCHAR(20) NOT NULL , 
	`credit` INT NOT NULL , 
	 PRIMARY KEY (`id`)
);
```

Baskets

* id:شناسه خرید
* customer_id:شناسه خریدار/مشتری
* amount: قیمت سبد خرید

```
CREATE TABLE `baskets` ( 
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
	`customer_id` INT UNSIGNED NOT NULL ,
	`amount` INT UNSIGNED NOT NULL ,
	PRIMARY KEY (`id`)
);
```

(برای خلاصه سازی از مابقی جزئیات همچون ریلیشن ها فاکتور میگیریم)
حالا یک تریگر مینویسیم که بعد از ثبت هر خرید مبلغ خرید amount را از اعتبار حساب مشتری credit کم کند.
برای تست یک مشتری به صورت زیر تعریف میکنیم:
```
INSERT INTO `customers` (`id`, `name`, `credit`) VALUES (NULL, 'Mahmoud', '1000000');
```

اگر از تریگر استفاده نمیکردیم میبایست بعد از درج هر خرید به صورت دستی کوئری زیر را اجرا میکردیم

```
UPDATE `customers` 
    SET `customers`.`credit`=`customers`.`credit` -  $BasketAmount
    WHERE `customers`.`id` = $CustomerId;
```

حال این کوئری رو در تریگر After Insert جدول خریدها قرار میدهیم که بعد از اعمال هر خرید خودکار این کار را انجام دهد:

```
CREATE TRIGGER `MyExampleName` AFTER INSERT ON `baskets`
FOR EACH ROW BEGIN
    UPDATE `customers` 
        SET `customers`.`credit`=`customers`.`credit` - NEW.`amount` 
        WHERE `customers`.`id` = NEW.`customer_id`;
END
```

دستور بالا تریگری رو تعریف میکنه که بعد از ورود داده در جدول baskets کوئری Update میگیره روی جدول مشتریها و با 

```
`customers`.`credit`=`customers`.`credit` - NEW.`amount`
```

مبلغ خرید رو از حساب مشتری کم میکنه و برای پیدا کردن مشتری از کاندیشن

```
 WHERE `customers`.`id` = NEW.`customer_id`;
```

استفاده میکنیم که مشتری مربوط به خریدمون رو پیدا کنه و کوئری رو روش اجرا کنه.


اگر بخواهیم از دستورات چند خطی و یا چند دستور در تریگر استفاده کنیم نیاز هست که از BEGIN  و END برای مشخص کردن ابتدا و انتهای دستورات استفاده کنیم در غیر اینصورت استفاده از اونها برای کوئریهای تک دستوری الزامی نیست.
با  NEW.نام ستون  میتونیم داخل تریگیر به مقادیر ستونهای اون رکوردی که تریگر داره روش اجرا میشه میتونیم دسترسی پیدا کنیم.
البته در تریگرهای آپدیت هم به NEW و هم به OLD دسترسی داریم که مقادیر قدیم و جدید هر ستون رو بر میگردونن و در تریگر حذف هم فقط به OLD.نام_ستون دسترسی داریم.
به طور کلی

```
CREATE TRIGGER `نام دلخواه` AFTER INSERT ON `نام جدول`
```

برای ساخت یک تریگر از اسلوب فوق استفاده میکنیم که برای تعیین زمان/نوع تریگر میتونیم از:

* AFTER INSERT
* BEFORE INSERT
* AFTER UPDATE
* BEFORE UPDATE
* AFTER DELETE
* BEFORE DELETE

که از اسامی آنها مشخص هست برای چه رخدادی تعریف میشوند و واضح هستش نیازی به ترجمه هم نداره!
دستورات شرطی مثل تعریف متغیرهای DECLARE و دستورات شرطی IF THEN/ELSE و حلقه ها و سایر دستورات برنامه نویسی یا کوئری نویسی رو میشه داخل تریگر اجرا کرد.


اگر موقع ثبت کوئری ساخت تریگر دچار مشکل شدید به خاطر این هستش که جدا کننده‌ی زبانSQL پیشفرض سمی‌کالن هستش که با سمیکالن داخل دستورات دچار تداخل میشه که برای جلوگیری از این اتفاق باید Delimiter کوئری رو از حالت پیشفرض به یک چیز دیگه مثلاً $$ تغییر بدید.
مثل:

```
DELIMITER $$;
Trigger Query 
$$
```

که سیمکالن با این روش دور میخوره و خطا نمیده.


منتظر فیدبکهاتون هستم.


[mysql]:https://files.virgool.io/upload/users/3676/posts/hohqrcxydcrt/ek4abnc9bhed.png "MySQL"
