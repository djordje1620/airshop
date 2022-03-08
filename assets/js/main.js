// Funkcija za dohvatanje podataka preko ajaxa
function dohvatiPodatke(file, result){
    $.ajax({
        url: file,
        method: "get",
        dataType: "json",
        success: result,
        error: function(err){
            console.log("greska pri dohvatanju podataka");
        }
    });
}

var pol = [];
var proizvodi = [];

window.onload = () => {

	var all_panels = $('.templatemo-accordion > li > ul').hide();

    $('.templatemo-accordion > li > a').click(function() {
        var target =  $(this).next();
        if(!target.hasClass('active')){
            all_panels.removeClass('active').slideUp();
            target.addClass('active').slideDown();
        }
      return false;
    });

    $('.product-links-wap a').click(function(){
      var this_src = $(this).children('img').attr('src');
      $('#product-detail').attr('src',this_src);
      return false;
    });
    $('#btn-minus').click(function(){
      var val = $("#var-value").html();
      val = (val=='1')?val:val-1;
      $("#var-value").html(val);
      $("#product-quanity").val(val);
      return false;
    });
    $('#btn-plus').click(function(){
      var val = $("#var-value").html();
      val++;
      $("#var-value").html(val);
      $("#product-quanity").val(val);
      return false;
    });
    $('.btn-size').click(function(){
      var this_val = $(this).html();
      $("#product-size").val(this_val);
      $(".btn-size").removeClass('btn-secondary');
      $(".btn-size").addClass('btn-success');
      $(this).removeClass('btn-success');
      $(this).addClass('btn-secondary');
      return false;
    });

    let url = window.location.pathname;
    console.log(url);
     if(url == "/airshop/index.html"){

        // ajax zahtev - socijalne mreze
        dohvatiPodatke("assets/data/drustveneMreze.json", function(result){
            ispisDrustvenihMreza(result, "zaglavlje", "#drustveneMreze");
            ispisDrustvenihMreza(result, "futer", "#drustveneMreze2");
        })
        dohvatiPodatke("assets/data/menu.json", function(result){
            ispisMenija(result);
        })
        dohvatiPodatke("assets/data/kategorije.json", function(result){
            ispisKatMeseca(result);
        })
        dohvatiPodatke("assets/data/proizvodi.json", function(result){
            ispispatika(result);
        })
        printCartLength();
     }

    if( url == "/airshop/assets/pages/about.html"){
       dohvatiPodatke("../data/servisi.json", function(result){
           ispisServisa(result);
       })
    }

    if( url == "/airshop/assets/pages/shop.html"){
        dohvatiPodatke("../data/proizvodi.json", function(result){
            ispisProizvoda(result);
            setItemToLocalStorage("allProducts", result);
        })
        dohvatiPodatke("../data/brendovi.json", function(result){
            ispisBP(result, "brend", "brend");
        })
        dohvatiPodatke("../data/kategorije.json", function(result){
            ispisBP(result, "kategorije", "kategorije");
        })
        dohvatiPodatke("../data/pol.json", function(result){
            ispisBP(result, "pol", "pol");
            pol = result;
        })
        
    }
    if(url == "/airshop/assets/pages/shop.html" || url == "/airshop/assets/pages/check.html" || url == "/airshop/assets/pages/contact.html" || url == "/airshop/assets/pages/about.html"){

        // ajax zahtev - socijalne mreze
        dohvatiPodatke("../data/drustveneMreze.json", function(result){
            ispisDrustvenihMreza(result, "zaglavlje", "#drustveneMreze");
            ispisDrustvenihMreza(result, "futer", "#drustveneMreze2");
        })
        dohvatiPodatke("../data/menu.json",function(result){
            ispisMenija(result);
        })
        printCartLength();
        
    }

    if(url == "/airshop/assets/pages/shop.html" || url == "/airshop/assets/pages/about.html"){
        dohvatiPodatke("../data/brendovi.json", function(result){
            ispisBrendaAbSh(result);
        })
    }
    if(url == "/airshop/assets/pages/check.html"){
        let productsFromCart = getItemFromLocalStorage("cart");

        if(productsFromCart == 0){
            showEmptyCart();
        }
        else{
            showCart();
        }
        printCartLength();

    }
    if(url == "/airshop/assets/pages/contact.html"){

        document.getElementById("dugme").addEventListener('click', function() {
            var ime = document.getElementById("inputName");
            var email = document.getElementById("inputEmail");
            var subject = document.getElementById("inputSubject");
            var message = document.getElementById("inputMessage");
           

            if(ime.value == "" || email.value == "" || subject.value == "" || message.value == ""){
                alert("polja ne smeju biti prazna");
                ime.classList.add("err");
                email.classList.add("err");
                subject.classList.add("err");
                message.classList.add("err");
            }
            else{
                ime.value = "";
                email.value = "";
                subject.value = "";
                message.value = "";
                ime.classList.remove("succes");
                email.classList.remove("succes");
                subject.classList.remove("succes");
                message.classList.remove("succes");
            }
        });
     
    }

}

//funkcija za ispis drustvenih mreza 
function ispisDrustvenihMreza(drustveneMreze, tip, selektor){
   let html = "";

   if(tip == "zaglavlje"){
       for(const dm of drustveneMreze){
           html += `<a class="text-light" href="${dm.href}" target="_blank"><i class="${dm.class} fa-sm fa-fw me-2"></i></a>`;
       }
       $(selektor).html(html);
   }
   if(tip == "futer"){
       html = `<ul class="list-inline text-left footer-icons">`;
       for(const dm of drustveneMreze){
        html += `<li class="list-inline-item border border-light rounded-circle text-center">
                    <a class="text-light text-decoration-none" target="_blank" href="${dm.href}"><i class="${dm.class} fa-lg fa-fw"></i></a>
                </li>`;
        }
    html += `</ul>`;
        $(selektor).html(html);
    }
}

//funkcija za ispis menija
function ispisMenija(menu){
    let html = "";
    let url = window.location.pathname;
    
    html += `<ul class="nav navbar-nav d-flex justify-content-between mx-lg-auto">`;

    if(url == "/airshop/index.html"){

        for(var m of menu){
            if(m.naziv == 'Home'){
                html += `<li class="nav-item">
                <a class="nav-link" href="/airshop/${m.href}">${m.naziv}</a>
            </li>`;
            }
            if(m.naziv != 'Home'){
                html += `<li class="nav-item">
                            <a class="nav-link" href="/airshop/assets/pages/${m.href}">${m.naziv}</a>
                        </li>`;
            }
        }
        html += `<li class="nav-item">
                    <a class="nav-link" target="_blank" href="https://djordje1620.github.io/portfolio.github.io/portfolio/">About author</a>
                </li></ul>`;
        document.getElementById("meni").innerHTML = html;
    }
    
    else{
        for(var m of menu){
            if(m.naziv == 'Home'){
                html += `<li class="nav-item">
                <a class="nav-link" href="../../${m.href}">${m.naziv}</a>
            </li>`;
            }
            if(m.naziv != 'Home'){
                html += `<li class="nav-item">
                            <a class="nav-link" href="${m.href}">${m.naziv}</a>
                        </li>`;
            }
        }
        html += `<li class="nav-item">
                    <a class="nav-link" target="_blank" href="https://djordje1620.github.io/portfolio.github.io/portfolio/">About author</a>
                </li></ul>`;
        document.getElementById("meni").innerHTML = html;
    }
}

//funkcija za ispis kategorijaMeseca
function ispisKatMeseca(data){
    let html = "";

    for(var k of data){
            html += `<div class="col-12 col-md-4 p-5 mt-3">
            <img src="./assets/img/${k.slika.src}" class="rounded-circle img-fluid border" alt="${k.slika.alt}"/>
            <h5 class="text-center mt-3 mb-3">${k.naziv}</h5>
            <p class="text-center"><a href="assets/pages/shop.html" class="btn btn-success">Go Shop</a></p>
        </div>`;
    }
    document.getElementById("katMeseca").innerHTML = html;
}
// funkcija za skladistenje podataka u local storage
function setItemToLocalStorage(name, data){
    localStorage.setItem(name, JSON.stringify(data));
}
// funkcija za iscitavanje podataka iz local storage-a
function getItemFromLocalStorage(name){
    return JSON.parse(localStorage.getItem(name));
}
//funckija za ispis proizvoda
function ispisProizvoda(data){
    data = sortCena(data);
    data = filterPol(data, "pol");
    data = filterPol(data, "brend");
    data = filterPol(data, "kategorije");

    let html = "";
    for(var p of data){
        html += `<div class="col-md-3">
                    <div class="card mb-4 product-wap rounded-0">
                        <div class="card rounded-0">
                            <img class="card-img rounded-0 img-fluid" src="../img/${p.slika.src}">
                            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                <ul class="list-unstyled">
                                    <input type="button" data-id=${p.id} value="Add to cart" class="button bg-success text-white btn add-to-cart"/>
                                </ul>
                            </div>
                        </div>
                        <div class="card-body">
                            <a href="shop-single.html" class="h3 text-decoration-none text-center">${p.naziv}</a>
                            <p class="text-center mb-0">${ispisCene(p.cena.aktuelnaCena, p.cena.staraCena)}</p>
                        </div>
                </div>
                </div>`;
    }
    document.getElementById("proizvodi").innerHTML = html;
    document.getElementById('filter').addEventListener('change', filterProizvod);
    $('.add-to-cart').click(addToCart);
}
// funkcija za dodavanje proizvoda u korpu
function addToCart(){
    let idProduct = $(this).data("id");
    
    let productsFromCart = getItemFromLocalStorage("cart");

    if(productsFromCart){

        if(productIsAlreadyInCart()){
            updateQty();
        }
        else{
            addNewProductToCart();
            printCartLength()
        }

    }
    else{
        // kod kada je korpa prazna
        addFirstProductToCart();
        printCartLength()
    }


    function addFirstProductToCart(){
        let products = [];
        products[0] = {
            id: idProduct,
            qty: 1
        }

        setItemToLocalStorage("cart", products);
    }

    function productIsAlreadyInCart(){
        return productsFromCart.filter(p => p.id == idProduct).length;
    }

    function updateQty(){
        let productsFromLS = getItemFromLocalStorage("cart");

        for(let product of productsFromLS){
            if(product.id == idProduct){
                product.qty++;
                break;
            }
        }

        setItemToLocalStorage("cart", productsFromLS);
    }

    // funkcija koja dodaje proizvod u punu korpu, a taj proizvod nije u njoj
    function addNewProductToCart(){
        let productsFromLS = getItemFromLocalStorage("cart");

        productsFromLS.push({
            id: idProduct,
            qty: 1
        });

        setItemToLocalStorage("cart", productsFromLS);
    }
}
// funkcija za ispisivanje broja proizvoda u korpi
function printCartLength(){
    let productsFromCart = getItemFromLocalStorage("cart");
    let productNumberSpan = $("#product-number");
    let productNumberText = "";

    if(productsFromCart){
        let productNumber = productsFromCart.length;

        if(productNumber == 1){
            productNumberText = ` ${productNumber} `
        }
        else{
            productNumberText = ` ${productNumber} `
        }
    }
    else{
        productNumberText = `0`
    }

    $(productNumberSpan).html(productNumberText);

}
// funkcija koja prikazuje sadrzaj ukoliko je korpa prazna
function showEmptyCart(){
    let html = `<div class="row">
                    <div class="col-12" id="potvrda">
                        <p class="alert alert-danger">There are currently no products in your cart.</p>
                    </div>
                </div>`
    $("#content").html(html);
}
// funkcija koja prikazuje proizvoda iz korpe
function showCart(){
    let allProducts = getItemFromLocalStorage("allProducts");
    let productsFromCart = getItemFromLocalStorage("cart");
    let htsml = ""

    let productsForDisplay = allProducts.filter(product =>{
        
        for(let productLS of productsFromCart){
            if(product.id == productLS.id){
                product.qty = productLS.qty
                return true;
            }
        }
        return false;
    })
    printDataFromCart(productsForDisplay);
    
}
function printDataFromCart(products){
    let html = `
    <table class="timetable_sub">
        <thead>
            <tr>
                <th></th>
                <th>Product</th>
                <th>Product Name</th>
                <th>Base Price</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Remove</th>
            </tr>
        </thead>
        <tbody>`;
        
        for(let p of products) {
            html += generateTr(p);
        }

        html +=`</tbody>
            </table>
            <div><input id="btn" type="button" class="btn btn-success mx-4" name="posalji" onclick="potvrdi()" value="Confirm"/></div>`;

        $("#content").html(html);

        function generateTr(p) {
            return  `<tr class="r1">
                        <td class="invert">${p.id}</td>
                        <td class="invert-image">
                            <a href="single.html">
                                <img src="../img/${p.slika.src}" style='height:100px' alt="${p.slika.alt}" class="img-responsive" />
                            </a>
                        </td>
                        <td class="invert">${p.naziv}</td>
                        <td class="invert">$${p.cena.aktuelnaCena}</td>
                        <td class="invert">${p.qty}</td>
                        <td class="invert">$${p.cena.aktuelnaCena * p.qty}</td>
                        <td class="invert">
                            <div class="rem">
                                <div class=""><button onclick='removeFromCart(${p.id})'>Remove</button> </div>
                            </div>
                        </td>
                    </tr>`;
        }
        
}
function removeFromCart(id) {
    let products = getItemFromLocalStorage("cart");
    let filtered = products.filter(p => p.id != id);

    setItemToLocalStorage("cart", filtered);
    
    if(filtered == ""){
        showEmptyCart();
    }else{
        showCart();
    }
}
function potvrdi(){
    showEmptyCart();
    document.getElementById("potvrda").innerHTML = "<p class='alert alert-success'>You have successfully ordered your products.</p>";
    printCartLength();
}



function filterProizvod() {
    dohvatiPodatke("../data/proizvodi.json", function(result){
        ispisProizvoda(result);
    })
}
//funkcija za sortiranje DDL
function sortCena(data) {
    const sortType = document.getElementById('filter').value;

    if(sortType == "0"){
        return data;
    }
    if(sortType === 'asc'){
        return data.sort((a,b) => a.cena.aktuelnaCena > b.cena.aktuelnaCena ? 1 : -1);
    }
    if(sortType === 'desc')
    {
        return data.sort((a,b) => a.cena.aktuelnaCena < b.cena.aktuelnaCena ? 1 : -1);
    }
    if(sortType == 'prep')
    {
        return data.filter(d => d.akcija)
    }
}

//funkcija za ispis cene
function ispisCene(aktuelnaCena, staraCena){
    let html = "";

    if(staraCena != false){
        html += `<p>${aktuelnaCena}$ <del>${staraCena}$</del>`;
    }
    else{
        html += `<p>${aktuelnaCena}$`;
    }
    return html;
}

//funckija za filtriranje po polu, brendu i kategoriji
function filterPol(data, name){

    const cekirani = document.querySelectorAll('input[name="' + name + '"]:checked');
    var cekiraniValue = [];
    cekirani.forEach(el => {
        cekiraniValue.push(Number(el.value))
    });

    if(name == "pol"){
        if(cekiraniValue.length) return data.filter(d => d.pol.some(z => cekiraniValue.includes(z)))
        return data;
    }
    if(name == "brend"){
        if(cekiraniValue.length) return data.filter(d => d.brend.some(z => cekiraniValue.includes(z)))
        return data;
    }
    else{
        if(cekiraniValue.length) return data.filter(d => d.kategorija.some(z => cekiraniValue.includes(z)))
        return data;
    }
}

// funkcija za ispis brenda,pola i kategorije
function ispisBP(data, name, identifikator){
    let html = "";

    for(var d of data){
        html += `<li>
                  <input type="checkbox" value="${d.id}" class="${name}" name="${name}" />
                  <span class="p-1">${d.naziv}</span>
                </li>`
    }
    document.getElementById(identifikator).innerHTML = html;

    document.querySelectorAll('.' + name).forEach(p => {
        p.addEventListener('change', filterProizvod)
    })
}

function ispispatika(data){
    let html = "";

    var brojac = 0;
    for(let d of data){
        if(brojac != 3){
            html += `<div class="col-12 col-md-4 mb-4">
            <div class="card h-100">
                <a href="assets/pages/shop.html">
                <img src="./assets/img/${d.slika.src}" class="card-img-top" alt="${d.slika.alt}" />
            </a>
            <div class="card-body">
                <ul class="list-unstyled d-flex justify-content-between">
                    <li>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-muted fa fa-star"></i>
                    </li>
                    <li class="text-muted text-right">${ispisCene(d.cena.aktuelnaCena, d.cena.staraCena)}</li>
            </ul>
            <a href="assets/pages/shop.html" class="h2 text-decoration-none text-dark">${d.naziv}</a>
            <p class="card-text">
                ${d.opis}
            </p>
            </div></div></div>`;
            brojac++;
        }else{
            break;
        }
    }
    document.getElementById("patike").innerHTML = html;
}

function ispisBrendaAbSh(data){
    let html = "";
    html += `<div class="carousel-item active">
                <div class="row" id="prvi">`;
    var brojac = 1;
    for(let d of data){
        if(brojac <= 3){
                html += `<div class="col-4 p-md-5">
                            <img class="img-fluid brand-img" src="../img/${d.slika.src}" alt="${d.slika.alt}" /></a>
                        </div>`;
                        brojac++;
                    }
        else if(brojac == 4){
            html += `</div></div> 
                        <div class="carousel-item">
                            <div class="row">
                                <div class="col-4 p-md-5">
                                    <img class="img-fluid brand-img" src="../img/${d.slika.src}" alt="${d.slika.alt}" /></a>
                                </div>`;
                        brojac++;
        }
        else{
               html += `<div class="col-4 p-md-5">
                            <img class="img-fluid brand-img" src="../img/${d.slika.src}" alt="${d.slika.alt}" /></a>
                        </div>`;
                brojac++;
           }  
    }
    html += `</div> </div>`;
    document.getElementById("caroseulBrend").innerHTML = html;

}
function ispisServisa(data){
    let html = "";

    for(let d of data){
        html += `<div class="col-md-6 col-lg-3 pb-5">
                    <div class="h-100 py-5 services-icon-wap shadow">
                        <div class="h1 text-success text-center"><i class="${d.icon}"></i></div>
                        <h2 class="h5 mt-4 text-center">${d.naziv}</h2>
                    </div>
                </div>`;
    }

    document.getElementById("servis").innerHTML = html;
}


// provera name
function nameValidate() {
    var ime = document.getElementById("inputName");
    var erIme = new RegExp(/^[A-ZČĆŽŠĐ][a-z]{1,11}$/);

    if(erIme.test(ime.value)){
        ime.classList.remove("err");
        ime.classList.add("succes");
    }else{
        ime.classList.remove("succes");
        ime.classList.add("err");
    }
}

// provera email
function emailValidate() {
    var email = document.getElementById("inputEmail");
    var erEmail = new RegExp(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2-8})?$/);

    if(erEmail.test(email.value)){
        email.classList.remove("err");
        email.classList.add("succes");
        return true;
    }else{
        email.classList.remove("succes");
        email.classList.add("err");
        return false;
    }
}
// provera subject
function subjectValidate() {
    var subject = document.getElementById("inputSubject");

    if(subject.value.length > 5){
        subject.classList.remove("err");
        subject.classList.add("succes");
    }else{
        subject.classList.remove("succes");
        subject.classList.add("err");
    }
}
// provera message
function messageValidate(){
    var message = document.getElementById("inputMessage");
    var tekst = document.getElementById("greska");

    if(message.value.length > 50){
        message.classList.remove("err");
        message.classList.add("succes");
        tekst.innerHTML= "";
    }
    else{
        message.classList.remove("succes");
        tekst.innerHTML= "Character number must be greater than 50";
        message.classList.add("err");
    }
}