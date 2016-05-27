# FRIENDSAKE

## Giriş

https://friendsake.herokuapp.com

**Friendsake**, sosyal ağlardaki arkadaş listelerinizi analiz ederek hangi adda kaç arkadaşınız olduğunu eğlenceli görseller eşliğinde gösterip paylaşmanızı sağlayan bir web uygulamasıdır.

Uygulama şu **Facebook** gönderisinde bahsedilen gereksinime yanıt vermesi amacıyla geliştirilmiştir:

https://www.facebook.com/kaplanseren/posts/10153615718557263

Gönderi sahibi her ne kadar sonradan adlarına göre arkadaşları gruplandırmanın çok zor bir iş olmadığını belirtmiş olsa da bunu hızlı ve düzenli bir şekilde yapacak bir uygulamanın olmaması beni Friendsake'i geliştirmeye yöneltmiştir. Bununla birlikte bu benim **Node.js**, **Express** ve **MongoDB** kullanarak geliştirdiğim ilk Facebook uygulaması.

Arkadaşları adlarına göre gruplandıracak bir uygulama geliştirme fikri ilk kez aklıma geldiğinde bunun bir günde halledilebilecek bir iş olduğunu düşündüm; amacım aynı gün içinde basit bir uygulama hazırlayıp yukarıda bahsettiğim gönderinin altında paylaşmaktı. İşin içine girince, teorik düzeydeki Node.js ve Express bilgimin pratikte ilk uygulamamı bu kadar hızlı bir şekilde hazırlamama yetecek düzeyde olmadığını fark ettim. Bu nedenle kendime bir çalışma takvimi hazırlayıp her gün yaklaşık 1 saatlik bir çalışmayla, bir yandan kodları da kendimce en iyi duruma getirerek ancak 8 günün sonunda uygulamayı hazır hale getirebildim.

Bu basit proje bana çok şey kattı; şu anda bile Node.js ile ilgili bilmediğim sayısız şey olduğunun farkındayım ancak en azından Express ve MongoDB ile sıfırdan bir sosyal ağ uygulamasının nasıl geliştirileceğine dair kafamda bir fikir oluştu diyebilirim.

Friendsake, ben bunları yazarken sadece Facebook ile entegre çalışıyor; bununla birlikte projenin kod alt yapısı **Twitter**, **Google+**, **Linkedin** gibi API desteği sağlayan ve bu arayüzlerle uygulama geliştirilmesine izin veren diğer servislere de entegre olabilecek şekilde inşa edildi.

Bu belgede, Friendsake tarzı bir uygulama geliştirmek için kullanılması gereken teknolojileri, izlenebilecek yönergeleri ve Node.js geliştiricilerin çoğunluğu tarafından onaylanan best practice'leri kısaca anlatmaya çalışacağım. Friendsake kodlarını istediğiniz gibi değiştirebilir ve dağıtabilirsiniz. Umarım paylaşacağım bilgiler bunu yapmanızı kolaylaştırır.

***

## Teknoloji

#### API
1. [Facebook Developers](https://developers.facebook.com)
2. [ImgFlip Meme Generator API](https://api.imgflip.com)

#### Servisler
1. [Heroku](http://www.heroku.com) (PaaS olarak, uygulamayı host etmek için)
2. [mLab](https://mlab.com) (DaaS olarak, veritabanını host etmek için)

#### Araçlar
1. [NVM](https://github.com/creationix/nvm) (1.1.0 - *Node.js kurulumu ve versiyon yönetimi için*)
2. [NPM](https://www.npmjs.com) (3.8.6 - *Node.js paketlerinin yüklenmesi ve yönetimi için*)
3. [Yeoman](http://yeoman.io) (1.8.1 - *Uygulama çatısının oluşturulması için*)
4. [Bower](http://bower.io) (1.7.9 - *Uygulamada kullanılan front-end bağımlılıklarının yüklenmesi için*)
5. [Gulp](http://gulpjs.com) (3.9.1 - *Uygulamanın derlenip çalışmaya hazır hale getirilmesi için*)
6. [Heroku Toolbet](https://toolbelt.heroku.com) (3.43.2 - *Deploy işlemleri ve production environment ayarlamaları için*)

#### Veritabanı
1. [MongoDB Community Server](https://www.mongodb.com/download-center#community) (3.2.6 - *Veritabanı yönetimi için*)

#### Back-End
1. [Node.js](https://nodejs.org) (6.1.0 - *Sunucu taraflı geliştirme için*)
2. [Express](http://expressjs.com) (4.13.3 - *İstemci taleplerini işlemek için*)
3. [Mongoose](http://mongoosejs.com) (4.4.17 - *Veritabanı işlemleri için*)

#### Front-End
1. [Bootstrap](http://getbootstrap.com) (3.3.6 - *İstemci arayüzü için*)
2. [JQuery](https://jquery.com) (2.2.3 - *İstemci taraflı geliştirme için*)

---

## Hazırlık
##### 1. Geliştirici Hesabının Ayarlanması
Friendsake gibi kullanıcıların Facebook ile giriş yapabildikleri, izinler doğrultusunda kullanıcının Facebook profil bilgileri ve arkadaş listeleri gibi verilerine erişebilen uygulamaların önce Facebook'a tanımlanması gerekmektedir. Bunu [Facebook Developer]((https://developers.facebook.com)) web sitesinde yapabilirsiniz. Kayıt işlemini gerçekleştirirken uygulamanın isim alanını, varsa site adresini ve çalışacağı alan adlarını belirtmek önemlidir. Uygulamayı genel kullanıma açana kadar sadece kendi yerel sunucunuzda çalıştırabileceğinizi de unutmayın. Facebook, uygulamayı tanımladığınızda size bir uygulama kodu (**APP ID**) ve uygulama gizi (**APP KEY**) verir. Bunları uygulamayı geliştirirken kullanacaksınız.

##### 2. Web Servislerinin Ayarlanması
Ben uygulamayı çevrimiçi kullanıma açmak için **PaaS** (Platform as a Service) olarak **[Heroku](http://www.heroku.com)**'yu tercih ettim. Düşük erişim ve kullanım oranlarına sahip uygulamalar için Heroku'nun ücretsiz katmanı rahatlıkla kullanılabilir. Uygulamanıza olan talep artarsa farklı bir fiyatlandırma katmanına geçerek uygulamayı ölçeklendirip artan taleplere yanıt verecek şekilde uygulamanızın performansını arttırabilirsiniz. Yerel sunucumuzdaki dosyaların Heroku üzerinde yayınlayabilmek için birazdan bahsedeceğim **[Heroku Toolbet](https://toolbelt.heroku.com)** denilen araç setini kullanıyoruz.

Friendsake'te veritabanı sunucusu olarak **MongoDB** kullandım. Verileri saklamak için, en azından development ve test ortamında **SQLite** da kullanılabilir ancak ben hepsinde Mongo'yu tercih ettim. Tabii çevrimiçi olarak kullanılan bir uygulamanın veritabanı da çevrimiçi olmalı; bu amaçla DaaS (Database as a Service) olarak **[mLab](https://mlab.com)**'te ücretsiz bir veritabanı oluşturdum (ücretsiz veritabanının boyutu en fazla `500 MB` olabiliyor; bununla birlikte Heroku'da olduğu gibi ücretli ölçeklendirme seçeneklerine sahipsiniz).

##### 3. Geliştirme Ortamının Hazırlanması
Node.js'i kendi web sitesinden indirerek kurabileceğiniz gibi kurulumu Node.js için geliştirilmiş **[NVM](https://github.com/creationix/nvm)** adlı araç yardımıyla da yapabilirsiniz. Bu aracın en güzel yanı, aynı geliştirme ortamına birden çok Node.js versiyonunu yükleyip sistem genelinde, oturum boyunca ya da sadece geliştirdiğiniz uygulama içinde istediğiniz versiyonu kullanabilmenizi sağlaması.

NVM'i yükledikten sonra, bu araç yardımıyla komut satırından istediğimiz Node.js versiyonunu indirip ayarlıyoruz (her şey birkaç basit komutla halledilebildiği için burada ayrıntıya girmeyeceğim). Tekrarlamak gerekise, NVM'e uygulamanızın hangi Node.js versiyonuyla çalışacağını bile belirtebilirsiniz.

Node.js paketlerini indirmek ve yönetmek için **[NPM](https://www.npmjs.com)**'i kullanıyorum. Sonraki aşamada gerekecek web geliştirme çatısını da NPM ile indireceğiz. Friendsake'in uygulama çatısını  **[Yeoman](http://yeoman.io)** ile oluşturdum. Yeoman'i yüklemek için aşağıdaki komutu vermeniz yeterli:

`npm install -g yo`

Friendsake, Express çatısıyla geliştirildi (üzerinde birkaç değişiklik yapmış olsam da best practice dışına çıkmadım). Çatıyı oluşturmak için gereken "generator" paketini aşağıdaki komutla indirip global olarak ayarlamak gerekiyor (kullanabileceğiniz diğer çatılar için Yeoman web sitesine göz atabilirsiniz):

`npm install -g generator-express`

Çeşitli görevlerle proje dosyalarını derleyip uygulamamızı çalıştırmamızı sağlayan **[Gulp](http://gulpjs.com)** paketi de bu çatıyla birlikte yükleniyor; ben Friendsake'te Gulp kullanmış olsam da siz çatıyı oluştururken dilerseniz Gulp yerine **[Grunt](http://gruntjs.com)**'ı da seçebilirsiniz.

Projelerimizde kullanacağımız, **[Bootstrap](http://getbootstrap.com)**, **[JQuery](https://jquery.com)** gibi statik kütüphaneleri, geliştirme kitlerini, kaynak dosyalarını ve istemci taraflı diğer araçları **[Bower](http://bower.io)** adlı komut satırı uygulamasıyla indirip bağımlılık olarak projemize ekliyoruz. Express çatısıyla projemize Node.js modülü olarak eklenen Bower'ın global kurulumunu aşağıdaki komutla gerçekleştirebilirsiniz :

`npm install -g bower`

Benim Friendsake'te yaptığım gibi geliştirme ortamında da veritabanı olarak MongoDB kullanacaksanız sisteminize **[MongoDB Community Server](https://www.mongodb.com/download-center#community)** yüklemeniz gerekiyor (bilgisayarınıza MongoDB sunucusu kurmak yerine, development ve test için de yukarıda bahsettiğim mLab gibi DaaS hizmetlerini kullanabilirsiniz ancak ben bunu pek önermiyorum; projeyi test ederken her zaman çevrimiçi olamayabileceğinizi de unutmayın).

MongoDB sunucusunu yükleyip Mongo servisini çalıştırdıktan sonra küçük bir komut satırı aracını kullanarak veritabanınızı yönetebilir, CRUD ve sorgulama işlemleri yapabilirsiniz. Birazdan "Geliştirme" kısmında bahsedeceğim gibi, uygulamamız çalıştığında veritabanı ve koleksiyonlar fiziksel olarak mevcut değilse, projede belirttiğimiz şemalara göre bunlar çalışma anında otomatik olarak oluşturuluyor.

Son olarak uygulamayı Heroku'da yayınlamakta kullanacağımız araç setine gereksinimimiz var. Geliştirme ortamınıza **Git** versiyon takip sistemini ve Heroku istemcisini kuracak olan **[Heroku Toolbet](https://toolbelt.heroku.com)** adındaki bu uygulama paketini
kendi web sitesinden indirip yükleyebilirsiniz.

---

## Geliştirme

#### 1. Kurulum
Node.js ve Express ile web uygulaması geliştirmeye projemiz için oluşturduğumuz klasörde bir terminal penceresi açıp aşağıdaki komutu vererek başlıyoruz:

`yo express`

Bu komutla Yeoman'e Express çatısını kullanarak yeni bir proje başlatmak istediğimizi söylüyoruz. Daha önce Express çatısı için gerekli olan generator modülünü indirip geliştirme ortamımıza tanıttığımızı unutmayalım. Komutu verdikten sonra, Yeoman proje için gereken ilk ayarları yapmak amacıyla bize bir dizi soru yöneltiyor. Bulunduğumuz konumda proje için yeni bir dizin oluşturmak isteyip istemediğimizi, projede **MVC** mimarisi kullanıp kullanmayacağımızı, MVC kullanacaksak hangi view engine'i tercih ettiğimizi belirtip, kullanmak istediğimiz **CSS** ön işleyiciyi, veritabanını ve derleme aracını seçtikten sonra Yeoman'in projeyi oluşturarak projenin bağımlılıklarını indirmesini bekliyoruz. Çatının kurulumu tamamlandığında, en temel haliyle bir Express projesine sahip olacağız.

Yeoman ile Friendsake'in çatısını oluştururken view engine olarak **[Jade](http://jade-lang.com)**'i, CSS ön işleyicisi olarak **[Node-Sass](https://github.com/sass/node-sass)**'i, derleme aracı olarak da daha önce belirttiğim gibi Gulp'u tercih ettim. Jade (yeni adıyla **[Pug](https://github.com/pugjs/pug)**), "_whitespace sensitive_" bir template engine; kodlama noktasında klasik HTML'den farklı bir yaklaşımı var. "_Indentation_" zorunlu kodlamaya aşina değilseniz Jade ile view kodlarken başta zorluk çekebilirsiniz ancak template'inizin ne kadar temiz ve düzenli olduğunu görüp etiketleri girintilerle açıp kapatmaya ve CSS seçicilerini kullanmaya alışınca Jade'ten vazgeçmek istemeyeceğinizi düşünüyorum.

CSS ön işleyicisi olarak Node-Sass kullanmamın nedeniyse, Sass'in **Ruby** bağımlılığı; kendi sistemimde, özellikle **Windows** ortamında Node.js projelerini çalıştırmak için ayrıca Ruby yüklemekten kaçınıyorum ama sizin geliştirme ortamınızda Ruby yüklenip ayarlanmışsa, Sass dosyalarını işleyip CSS haline getirmek için Node-Sass yüklemenize gerek yok.

Çatınızı oluştururken benim Friendsake'te yaptığım gibi Gulp'u tercih ettiğinizde, Gulp ve araçları development bağımlılığı olarak "`package.json`" dosyanıza eklenir, uygulamayı çalıştırmak için gereken tüm komutlar "`gulpfile.js`" dosyasında tanımlanır (Gulp ayrıca, projedeki değişiklikleri izleyen çeşitli watcher'lar da sağlamaktadır; bu sayede uygulamanız çalışırken kodlarda bir değişiklik yaparsanız, değişikliklerin etkili olabilmesi için web sunucunuzu yeniden başlatmanıza gerek kalmaz, öyle ki Sass dosyalarınız bile anında CSS haline getirilir).

Çatınızın kurulumu tamamlandıktan sonra uygulamanızı çalıştırmak için aşağıdaki komutu vermeniz yeterlidir:

`gulp`

Bu basit adımları takip ederek, `3000` portundan erişilebilen bir web sunucusuna ve bu sunucu üzerinde çalışan bir Express uygulamasına sahip oldunuz; web tarayıcınızı açıp "`http://localhost:3000`" adresine gittiğinizde uygulamanızın sizi karşıladığını görebilirsiniz. Tabii çalışan bir web çatısına sahip olmak, her şeyin bittiği anlamına gelmiyor. Daha yüklenmesi gereken modüller, ayarlaması gereken route'lar, yazılması gereken controller'lar var.

Kodlamaya geçmeden önce iyi bir alışkanlık olarak Git repository'sini oluşturmak gerekiyor. Bunun için terminal ekranında sırasıyla aşağıdaki komutları girebilirsiniz:

`git init`

`git add .`

`git commit -m "İlk commit."`

Böylece Git veritabanımızı oluşturup projemizdeki tüm dosyaları bu veritabanına ekledik ve "`commit`" ederek dosyaların o an "**staging area**" denilen bölgede bulunan durumunu kayıt altına aldık. Commit ettiğimiz tüm değişiklikler adımız ve e-posta adresimizle saklanıyor (Heroku Toolbelt kurduktan sonra Git ayarlarını yaptığınızı farz ediyorum).

Uygulamamızı Heroku'ya deploy edeceğiz. Bu nedenle repo'muzu oluşturduktan sonra aşağıdaki komutu vererek Heroku üzerinde yeni bir uygulama oluşturuyoruz:

`heroku create`

Bu işlemin sonucunda, Heroku bize aşağıdakine benzer bir URL ve Git adresi veriyor:

`https://infinite-journey-28664.herokuapp.com/ | https://git.heroku.com/infinite-journey-28664.git`

Heroku tarafından sağlanan Git adresini deploy işlemi için remote olarak Git repository'mize eklemeliyiz:

`heroku git:remote -a infinite-journey-28664`

Projemiz şu anda Heroku'ya deploy edilebilir durumda olmalı. Uygulamayı, yukarıdaki URL üzerinden erişip çalıştırabilmek için dosyaları Heroku sunucusuna `push` etmemiz yeterli. Tabii öncesinde birkaç küçük ayar ve isteğe bağlı olarak bazı düzenlemeler yapmamız gerekiyor ki bunları birazdan ele alacağız.

#### 2. Düzenleme
Yeoman ile bir Express çatısı kurulumu yaptığınızda, proje klasörünüzde aşağıdaki gibi bir dosya ağacı oluşur:

```
app
  controllers
    home.js
  models
    article.js
  views
    error.jade
    index.jade
    layout.jade
config
  config.js
  express.js
node_modules
  ... Node.js modülleri
public
  components
    ...
  css
    style.scss
  img
    ...
  js
    ...
.bowerrc
.editorconfig
.gitignore
app.js
bower.json
gulpfile.js
package.json
````
Bu son derece düzenli bir yapı ve Node.js best practice'lerine de uyuyor ancak ben Friendsake'te `app` klasörünün içindekileri root dizinine taşıyarak işe başladım. Siz böyle yapmak zorunda değilsiniz; aksine, MVC yapınızı `app.js` ile aynı adı taşıyan bir dizin altında konuşlandırmak gayet yerinde bir yaklaşım olacaktır.

Friendsake'in web arayüzünü **Bootstrap** ve **JQuery** ile hazırladım. Projenize bunun gibi  statik kütüphaneleri **Bower** aracılığıyla ekliyorsunuz. Örneğin Bootstrap'in son sürümünü (ya da versiyon numarası belirterek istediğiniz bir sürümü) indirip `public\components` altına kopyaladıktan sonra `bower.json` dosyasında kayıt altına almak için şu komutu vermeniz yeterli:

`bower install bootstrap --save`

`public\components` klasörü `.gitignore` dosyası sayesinde gözardı edilerek sunucuya push edilmiyor; bu nedenle statik kütüphenelerin deploy sırasında Heroku tarafından indirilmesi için, yukarıdaki gibi `save` anahtarını kullanarak, bileşeni bağımlılık olarak projemize eklemiş oluyoruz. Tabii Heroku'ya bağımlılıkları nasıl indirip ayarlayacağını da bildirmemiz gerekiyor. Bunun için `package.json` dosyasındaki `scripts` kısmına aşağıdaki anahtar, değer çiftini eklemeliyiz:

`"postinstall": "./node_modules/bower/bin/bower install"`

_(Yukarıdaki gibi Bower binary'sinin tam yolunu yazmak yerine, artık `bower install` yazmanın yeterli olduğu söylense de ben bundan sonuç alamadım.)_

Projemizi Heroku'ya push etmeden önce son olarak `package.json` dosyasına aşağıdaki değerleri girmemiz gerekiyor:

````
"engines": {
  "node": "6.1.0"
}
````

Bu sayede Heroku'ya, uygulamayı hangi engine ile çalıştıracağını söylüyoruz. Artık projemizi deploy edebiliriz. Yapmamız gereken tek şey, **[GitHub](https://github.com)** ve **[Bitbucket](https://bitbucket.org)** gibi servisleri kullananların alışık olduğu standart `remote push` komutunu vermek:

`git push heroku master`

Bu komutla birlikte projemiz Heroku'daki master branch'e push edilip aynı zamanda production deploy işlemi gerçekleştirilir. İşlem başarıyla sonuçlanmışsa, daha önce Heroku'nun bize verdiği URL'den ya da terminale `heroku open` yazarak uygulamamıza erişebiliriz; tüm ayarları doğru yapmışsak, web tarayıcımızdan sayfanın adresini çağırdığımız anda bize ayrılan web sunucusu başlatılarak uygulamamız çalıştırılacaktır.

#### 3. Güvenlik

Friendsake gibi açık kaynaklı projeleri GitHub ya da benzeri  platformlarda yayınlayanlar için üzerinde durulması gereken en önemli nokta, uygulama anahtarlarının ve veritabanı parolaların güvenliğinin nasıl sağlanacağıdır. Açık bir şekilde bunları "public" olarak push etmemeniz gerekiyor; bu konuda benim izlediğim yöntem, parolaları ve anahtarları "**ENVIRONMENT VARIABLE**", yani ortam değişkeni olarak ayarlayıp geliştirme ortamının dışına çıkmasını engellemek. Bunu yapmak için **[dotenv](https://github.com/motdotla/dotenv)** adında bir Node.js modülü kullanıyorum. Modülü projenizin bağımlılıklarına eklemek için aşağıdaki komutu vermeniz yeterli:

`npm install dotenv --save`

dotenv yüklendikten sonra projenizin root dizininde "`.env`" adında bir dosya oluşturup ortam değişkenlerinizi bu dosyanın içinde ayarlayabilirsiniz. Friendsake'te public ortamlardan sakladığım, `SSH_SECRET` ve API erişimi için kullanılan birkaç anahtar var. Bunların, gizlenmeye gerek olmayan birkaç değişkenle birlikte tamamı aşağıdaki gibi `.env` dosyasında kayıtlı:

````
PORT=3000
DEV_MONGODB=mongodb://localhost/friendsake-development
TEST_MONGODB=mongodb://localhost/friendsake-test

SSH_SECRET=Gizli_anahtar

IMGFLIP_USERNAME=ImgFlip_KullaniciAdi
IMGFLIP_PASSWORD=ImgFlip_Parolasi

FB_APP_ID=Facebook_UygulamaKodu
FB_APP_KEY=Facebook_UygulamaGizi
FB_CALLBACK_URL=Facebook_DonusAdresi
````

**Not: `.env` dosyasını `.gitignore` içine ekleyip Git tarafından takip edilmemesini sağlamalısınız; dosyanın GitHub'a ya da herhangi bir public ortama push edilmesini istemiyoruz.**

dotenv, production ortamında değişkenleri `.env` dosyasından okumuyor; ortam değişkenlerimizi tek tek Heroku'ya eklememiz gerekecek. Bu amaçla, terminal üzerinde her değişken için aşağıdakine benzer bir komut çalıştırmalıyız (`PORT` değişkeni varsayılan olarak Heroku'da ayarlanmış durumda olduğundan bu değişkeni eklemenize gerek yoktur):

`heroku config:set SSH_SECRET=123`

**Not: Yukarıda `.env` dosyasında tuttuğum değişkenlere ek olarak "`PROD_MONGODB`" adında, mLab'te tuttuğum production veritabanına ait sunucu adresini içeren bir ortam değişkeni daha kullanıyorum (sunucu adresi, aynı zamanda veritabanı bağlantı dizesi olarak da kullanıldığından kullanıcı adı ve parola içerebiliyor); bu değişkeni dosyaya ekleme gereği duymadım ancak `heroku config:set` komutuyla değişkeni Heroku'ya tanıtmayı ihmal etmedim.**

Ortam değişkenlerine uygulama içinden erişmek için dotenv modülünü aşağıdaki gibi kullanabiliriz:

`require('dotenv').config();`

Herhangi bir ortam değişkenini okumak içinse (örneğimizde `SSH_SECRET`);

`var secret = process.env.SSH_SECRET;`

#### 4. Kodlama (Back-End)

Friendsake, MVC mimarisiyle geliştirilen bir web uygulaması. Veritabanımızı açıkça modelleyip, kendi tanımladığımız route'lar üzerinden erişilen kısımları template'ler aracılığıyla render edip istemciye gönderiyoruz. Friendsake projesinin root dizininde `controllers`, `models` ve `views` klasörleriyle kurduğum bu yapıya ek olarak çeşitli modül yapılandırmalarını içeren `config` ve kendi yazdığım yardımcı modülleri yerleştirdiğim `helpers` adlarında iki klasörüm daha var. Ana dizindeki ayar dosyalarıyla birlikte projenin back-end kısmı bu şekilde özetlenebilir. İstemciye gönderilen statik dosyalarsa `public` klasöründe tutuluyor ki bunlar da Jade tarafından render edilen HTML içeriğiyle birlikte uygulamanın front-end kısmını oluşturuyor.

Friendsake'in, Express çatısıyla birlikte yüklenip ayarlanan modüllere ek olarak, benim eklediğim birkaç modüle daha gereksinimi var. Bunların en önemlilerini, işlevleriyle birlikte aşağıdaki gibi sıralayabiliriz:

* **[i18n](https://github.com/mashpie/i18n-node) (Yerelleştirme)**

    i18n modülünü yerelleştirme için kullanıyorum. Bu belge yazılırken, Friendsake'in **Türkçe** ve **İngilizce** olmak üzere iki dil için desteği bulunuyor. Modülü projenize bağımlılık olarak eklemek için aşağıdaki komutu vermeniz yeterli:

  `npm install i18n --save`

  Ben uygulamanın birçok yerinde kullandığım için  i18n'i `app.js` dosyasında şu şekilde ayarlayıp "global" olarak register ettim:

  ````
  i18n.configure({
    defaultLocale: 'en',
    directory: config.root + '/public/i18n',
    register: global
  });
  ````
  Bu tanımdan da anlayabileceğiniz gibi i18n yerelleştirme dosyaları `public\i18n` dizininde duruyor ve varsayılan dil olarak İngilizce bekleniyor. Bununla birlikte, ziyaretçinin işletim sisteminde ya da web tarayıcısında ayarlı dile uygun içeriği göndermek için `config\express.js` dosyasına bir "middleware" ekledim:

  ````
  app.use(function (req, res, next) {
    var Negotiator = require('negotiator');
    var lang = new Negotiator(req).language();

    i18n.setLocale(lang);

    next();
  });
  ````
  **Not: [negotiator](https://github.com/jshttp/negotiator) bileşenini, HTTP üst bilgilerini okumak için kullanabilirsiniz. Bu örnekte, istemcinin tercih ettiği dilin "en" ya da "tr-TR" benzeri kısa kodunu alıyoruz.**

  Uygulamanın varsayılan dili belirtilip, işleyici de uygulama düzeyinde global olarak ayarlandığı için, istediğim herhangi bir modül içinde aşağıdaki gibi bir sözdizimi kullanabiliyorum:

  `__('Welcome to Friendsake!')`

  Uygulama çalıştırıldığında i18n, `public\i18n` dizinindeki varsayılan ve tercih edilen dil dosyalarının içine bakacak, `Welcome to Friendsake.` ifadesini bulamazsa bu ifade için şunun gibi bir anahtar, değer çifti oluşturacaktır:

   `"Welcome to Friendsake!": "Welcome to Friendsake!"`

   Ayrıca dil dosyaları yoksa, bu dosyalar da otomatik olarak i18n tarafından oluşturulur (farklı bir dosya biçimi belirtmediğiniz sürece dil dosyaları `JSON` biçimindedir). Türkçe dil desteği için `tr-TR` dosyasını açıp anahtarı aşağıdaki gibi ayarlayabilirsiniz:

   `"Welcome to Friendsake!": "Friendsake'e hoşgeldiniz!"`

   `Welcome to Friendsake!` ifadesini projenin her yerinde uzun uzun yazmak istemiyorsanız dil dosyasındaki anahtar tanımınız için bir kısaltma belirleyip kodun içinde bu kısaltmayı da kullanmanız mümkündür. Bu kullanımı bir örnekle pekiştirelim:

   `pub\i18n\en.json`
   ````
  {
    "welcome": "Welcome to FriendSake!"
  }
   ````
  `pub\i18n\tr-TR.json`
   ````
  {
    "welcome": "Friendsake'e hoşgeldiniz!"
  }
   ````
  `views\index.jade`
   ````
  h1.header= __('welcome')
   ````
* **[Lodash](https://lodash.com) (Kolaylaştırma)**

  Lodash, **[Underscore](http://underscorejs.org)** gibi hem sunucu hem de istemci tarafında kullanılabilen bir JavaScript kütüphanesi. İçinde `Array`, `Collection`, `Date`, `Number`, `Object` ve `String` işlemleri için birçok yardımcı metod bulunuyor. Friendsake'i geliştirirken bu kütüphaneyi sık sık kullansam da, Lodash proje içinde en çok Facebook'tan çekilen arkadaş listesini ada göre gruplandırıp sıralamam gerektiğinde işime yaradı:

  `controllers\friend-list.js`
  ````
  var grouped = _.chain(result)
    .sortBy(function (friend) {
      return _.chain(friend.name).lowerCase().deburr();
    })
    .groupBy(function (friend) {
      return _.chain(friend.name).words().head();
    })
    .toPairs()
    .map(function (friend) {
      return _.zipObject(['name', 'users'], friend);
    })
    .sortBy(function (obj) {
      return -obj.users.length;
    })
    .value();
  ````
  Bu blok sayesinde, `result` içinde tutulan arkadaş listesini tek seferde gruplandırıp sıralayabiliyoruz. Yukarıda belirttiğim gibi, çok kullandığım için Lodash'i uygulama genelinde global olarak tanımlamayı ve "`_`" adında bir değişkende saklamayı uygun gördüm. Bunu da `app.js` içinde şu şekilde yaptım:

  `global._ = require('lodash');`

  **Not: Yeri gelmişken, Node.js'te değişkenleri global olarak tanımlamanın pek önerilmediğini, bunun yerine ilgili modülü kullanacağımız dosyada import etmenin daha çok benimsendiğini belirtelim.**

* **[Passport](http://passportjs.org) (Yetkilendirme)**

  Bu middleware'i kullanıcının Facebook ile giriş yapmasını ve uygulamayı yetkilendirmesini sağlamak için kullanıyoruz. Passport ile ilgili tüm ayarlamalar `config\passport.js` dosyasında yapılıyor. Passport'ün 300'den fazla giriş yönteminde kullanılabilecek bir "strategy" arabirimi var. Friendsake'te Facebook strategy'sini kullandım. Passport'ü ve ilgili strategy'yi uygulama bağımlılıklarına eklemek için terminal ekranında sırasıyla aşağıdaki komutları vermemiz gerekiyor:

  `npm install passport --save`

  `npm install passport-facebook --save`

  Passport'ü ve stratejimizi `config\passport.js` dosyasında ayarlarken giriş yapan kullanıcının profil bilgilerini `models\user.js` dosyasındaki **[Mongoose](http://mongoosejs.com)** şemamızda tanımlandığı şekliyle MongoDB veritabanımızdaki `users` koleksiyonumuza ekliyoruz. Ayrıca, middleware'imizi kullanarak istemcinin her talebinde istediğimiz kullanıcı bilgilerini "Request" değişkeni üzerinden controller'larımıza taşıyabiliriz. Bunu sağlayan da son adımda, aşağıdaki blok:

  `config\passport.js`
  ````
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, {
        id: user.id,
        facebook: user.facebook
      });
    });
  });
  ````
  Middleware'i `controllers\auth.js` controller'ı içinde, `passport` modülüyle import edip yetkilendirme için belirlediğimiz router'larla kullandığımızı görebilirsiniz. `auth.js` içindeki ilk router, Facebook yetkilendirme ekranı için, ikinci router ise bu ekrandan dönülecek adres için tanımlanmış durumda; yetkilendirmede bir sorunla karşılaşılırsa ya da kullanıcı uygulamamıza yetki vermezse uygulamanın ana sayfasına dönülüyor.

  Passport'ün kullanımıyla ilgili daha detaylı bilgi almak için projenin kendi sayfasını ziyaret edebilirsiniz.

***
Şimdilik Friendsake'in back-end kodlamasıyla ilgili üzerinde duracağımız son konu, uygulamanın **[ImgFlip](https://imgflip.com)** sitesi aracılığıyla nasıl görsel üretebildiği. ImgFlip, "meme" (bizdeki adıyla "caps") sitesi olmakla birlikte kendi görsellerimizi hazırlayabilmemiz için çeşitli araçlar sağlıyor; bir kullanıcı hesabı oluşturduktan sonra, ister sitedeki hazır şablonları kullanarak, ister resim dosyası yükleyip düzenleyerek basit görseller hazırlayabiliyoruz. Ayrıca ImgFlip'in bu iş için bir de **[API erişimi](https://api.imgflip.com)** bulunuyor ki ben de Friendsake'te REST tabanlı bu JSON arabirimi kullandım zaten.

ImgFlip görsellerini, `helpers\image-generator.js` modülü aracılığıyla üretiyoruz. Görsel üretmek için birkaç şablon tanımlayıp MongoDB veritabanındaki `templates` koleksiyonuna kaydettim. `models\template.js` Mongoose şemasında görebileceğiniz gibi, koleksiyonda şablonun ImgFlip tarafından sağlanan `id`'sini ve görsellere uygun düşecek şekilde düşünülüp yerelleştirilmiş `title` ve `description` tanımlarını tutuyoruz. mLab üzerinde barındırdığım kendi koleksiyonumda şunun gibi dökümanlar bulunuyor:

````
{
  "id": "67968965",
  "tr-TR": {
    "title": "#name adındakileri her zaman eklemem.",
    "description": "Ama eklediğimde listemde #number #name olur."
  }
}
````
`67968965`, kendi kullanıcı hesabımla ImgFlip'e yüklediğim bir şablonun `id`'si; `title` ve `description` ise ImgFlip API'ı aracılığıyla bu şablondan oluşturulacak görselin üstünde ve altında yazmasını sağlayacağımız kısa cümlelerdir. `image-generator.js` kodu çalıştırılınca, bu cümlelerin içinde geçen `#name` ve `#number` yer tutucuları, kod içinde yürütme anında elde edilen değerlerle değiştiriliyor. ImgFlip REST arabirimine `POST` ettiğimiz data şu şekilde:

`helpers\image-generator.js`
````
{
  url: 'https://api.imgflip.com/caption_image',
  form: {
    template_id: template.id,
    username: process.env.IMGFLIP_USERNAME,
    password: process.env.IMGFLIP_PASSWORD,
    boxes: [{
      text: title,
      x: 10,
      y: 28,
      width: 775,
      height: 60
    }, {
      text: description,
      x: 10,
      y: 502,
      width: 775,
      height: 60
    }]
  }
}
````
Kodda görebileceğiniz gibi, JSON olarak gönderdiğimiz data'nın içinde ImgFlip kullanıcı adı ve parolamızı açıkça belirtmemiz gerekiyor. ImgFlip hesabıma yüklediğim şablonlar 800x600 boyutunda olduğundan ve sadece bu şablonları kullandığım için `x`, `y`, `width` ve `height` değerlerini sabit verebiliyorum; ImgFlip'e başkaları tarafından yüklenen şablonları kullanmak isteseydim, görselin altına ve üstüne yazacağım her yazı için bu değerleri farklı vermem gerekecekti (`templates` koleksiyonundaki her dökümana ilgili değerleri ekleyerek bu işi kotarabiliriz ancak ben bu konuda hem biraz kolaya kaçtım hem de kendi görsellerimi kullanarak işimi sağlama aldım).

`POST` işlemi başarıyla gerçekleşirse ImgFlip tarafından oluşturulan görselin kendisinini ve içinde bulunduğu sayfanın URL'ini elde ediyoruz. Son olarak `image-generator` modülünü `controllers\friend-list.js` router'ı içinde aşağıdaki gibi kullandığımızı ekleyelim:

`var generator = require('../helpers/image-generator');`

`...`

````
generator.generate(
  history.name,
  history.number,
  fnGenerate(friends, history, user)
);
````

`...`

````
var fnGenerate = function (friends, history, user) {
  return function (info) {
    history.image = info.image;
    history.title = info.title;
    history.description = info.description;

    user.save();

    res.json({
      info: info,
      friends: friends,
      url: req.protocol +
      '://' + req.headers.host +
      '/' + provider +
      '/profile/' + req.user[provider].id +
      '?uid=' + req.session.uid
    });
  }
}
````

Yukarıdaki koddan da görebileceğiniz gibi ürettiğimiz görsele ait bilgiler, kullanıcıyla ilişkili `history` adındaki bir koleksiyona kaydediliyor ve ilgili dökümanın `uid` değeriyle -ki bu değer  `session` olarak da saklanıyor- oluşturulan URL, kullanıcının sayfadaki bir bağlantı aracılığıyla paylaşabilmesi için istemciye gönderiliyor.

#### 5. Kodlama (Front-End)

Friendsake'in istemci arayüzünü Bootstrap ve JQuery ile tasarladım. Bootstrap teması olaraksa **[Bootswatch](http://bootswatch.com)** sitesindeki ücretsiz temalar arasından **[Superhero](http://bootswatch.com/superhero)**'yu tercih ettim. Front-end ile ilgili en önemli ayrıntı, statik kütüphanelerin geliştirme ortamında çalışırken `public` dizininden, production ortamında, yani Heroku uygulaması olarak çalışırken de kendi CDN sunucularından ya da **[RawGit](https://rawgit.com)** ile GitHub üzerinden yüklenmesi. Bu yolu tercih etmemin nedeni, -her ne kadar Heroku'nun kendi caching mekanizması olduğunu düşünsem de- gereksiz trafikten kaçınmaktı; ücretsiz kaynakları idareli bir şekilde kullanmak için bu tarz çözümleri göz ardı etmemek gerekiyor. Bu işlem, CSS ve JavaScript gibi varlıkların tanımlandığı `views\layout.jade` dosyasında aşağıdaki gibi yapıldı:

````
if ENV_DEVELOPMENT
  script(src='/components/jquery/dist/jquery.min.js')
else
  script(src='https://code.jquery.com/jquery-2.2.3.min.js')
````

Friendsake'in benim tarafımdan yazılmış front-end JavaScript kodları, `public\js\app.js` dosyasında duruyor. Her route için ayrı dosyalar oluşturup ilgili view'in `block js` kısmında sayfaya dahil etmektense, işimi tek bir dosyayla halletmeyi uygun gördüm. Aslında `app.js` istemci taraflı basit bir routing içeriyor; **[Page](https://github.com/visionmedia/page.js)** adında, Express örnek alınarak geliştirilen bir router sayesinde sadece o an bulunulan sayfayla ilgili JavaScript kodlarının çalışmasını sağladım. Tüm sayfalarda ortak olan kodların yanında, sunucuya arkadaş listesi için `GET` talebinde bulunan JQuery kodu sadece `/facebook/friends` path'inde devreye giriyor. Page'in ilk parametresi `path`, ikinci parametresi `callback` fonksiyonumuz (`callback` içinde, Express'te olduğu gibi `next()` denilebiliyor, tüm sayfalarda yürütülmesi gereken `init()` fonksiyonunu bu şekilde çalıştırıyorum):

````
// friends() callback fonksiyonunu çağır
page('/:provider/friends', friends);

// friends() içindeki next() ile bu route devreye girecek
page('*', init);
````

`init` fonksiyonunun en önemli işlevi, **Adobe** ve **Google** tarafından geliştirilen **[Web Font Loader](https://github.com/typekit/webfontloader)** kütüphanesi aracılığıyla `public\css\style.scss` içinde kullandığım `Fira Sans` ve `Lora` adlı yazı tiplerini **[Google Fonts](https://www.google.com/fonts)**'tan yüklemesi; sunduğu ek kontroller ve paremetrik çalışma olanağıyla, özellikle arayüz tasarlanırken çok fazla web font kullanılması gereken durumlarda işe yarayacak bu özelliği, örnek olması açısından projeye dahil ettim. Web Font Loader ile kullanmak istediğiniz fonta ait JavaScript kodunu, fontun kendi sayfasından alabilirsiniz. Örneğin Google Fonts'un **[Open Sans](https://www.google.com/fonts/#QuickUsePlace:quickUse/Family:Open+Sans)** sayfasında yer alan JavaScript kodu, işaretlediğiniz seçeneklere bağlı olarak şuna benzeyecektir:

````
WebFontConfig = {
  google: { families: [ 'Open+Sans:300,300italic,600:latin,latin-ext' ] }
};
````

---

## Sonuç

Friendsake uygulaması, bu belgeyi hazırlamak için harcadığım iki günü de sayarsak, neredeyse 10 günlük bir çalışma sonucunda ortaya çıktı. Aslında şu an incelemekte olduğunuz, projenin ilk GitHub repo'su değil; **README.md** dosyasını yazmaya başlamadan önce orjinal repo'da 60'ın üzerinde commit bulunuyordu. Bu kadar küçük çapta bir proje için böylesine yoğun bir versiyon günlüğü paylaşmanın abartılı olacağını düşündüğüm için Git repo'sunu silip yeniden oluşturdum ancak kodları yazarken neden bu kadar çok commit'in ortaya çıktığını açıklamak istiyorum: Proje küçük olsa da içinde Express ile Node.js uygulaması geliştirmeye dair, MongoDB işlemleri, üçüncü parti API erişimi, yerelleştirme ve yetkilendirme gibi birçok bilgi ve veri barındırıyor. Her şeyden önce bu benim ilk Express projem; bundandır ki az önce bahsettiğim işlerin Node.js ile nasıl kotarılabileceğine dair az çok fikrim olmasına karşın konuyla ilgili neredeyse hiç deneyimim yoktu. Bununlar birlikte, titiz bir geliştirici olarak yazdığım kodun, her seferinde *aslında öyle yazılmaması gerektiğine* dair güçlü bir dürtüye sahip olduğum için kısacık kod bloklarını bile sürekli elden geçiriyor, farklı modüllere taşıyor, daha anlaşılır hale getirmeye çalışıyorum.

Projenin eksikleri yok mu peki? Olmaz mı... İçime dert olan bazı noktaları gizlemeyeceğim. İlk olarak, projeyi "**test driven**" anlayışıyla geliştirmemenin tatminsizliğini yaşıyorum; uygulamayı debug ederken terminal'de aldığım loglar, olası hataların çoğunu önüme dökse de, birkaç test yazıp repo'ya eklemek ve bu belgede bundan biraz bahsetmek hiç fena olmazdı. Ayrıca belirtmem gerekir ki, Friendsake aslında bir **[MEAN Stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle))** uygulaması olabilecekken, **[AngularJS](https://angularjs.org)**'i projeye yediremediğim için bu fırsatı ucu ucuna kaçırdı. Neyse ki Express ile kurduğum MVC yapısı ve front-end'teki kodların son derece kısıtlı bir işleve sahip oluşu nedeniyle Angular'ın eksikliği projede pek hissedilmiyor.

Buraya kadar okuyanlara teşekkürü borç bilirim.

Peki siz bu belgede bahsettiğim konular hakkında ne düşünüyorsunuz? Friendsake'in kodlarını incelediniz mi? Sizce proje `fork` etmeye değer mi? Hem bu soruların yanıtını merak ediyor, hem de burada yazdıklarımla ilgili yeni soruların yöneltilmesini heyecanla bekliyorum. Bana aşağıdaki sosyal medya hesaplarından ulaşabilirsiniz. Hiçbir iletişim çağrısını karşılıksız bırakmıyorum; bu nedenle aklınıza ne gelirse gelsin lütfen benimle paylaşmaktan çekinmeyin.

Sevgiler.

Kemal E. Yılmaz

**[E-Posta](mailto://mail@kemalersin.com)** | **[Facebook](https://www.facebook.com/kemalersinyilmaz)** | **[Twitter](https://twitter.com/kemal_ersin)** | **[Linkedin](https://www.linkedin.com/in/kemal-e-yılmaz-a00447120)** | **[GitHub](https://github.com/kemalersin)**
