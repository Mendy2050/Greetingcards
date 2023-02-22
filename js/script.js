$(document).ready(function(){
    // Form custom validation
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    // Documentation here - https://getbootstrap.com/docs/5.0/forms/validation/
    var forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }else{
                    event.preventDefault();
                    event.stopPropagation();
                    
                    if($(form).attr('id') == 'subscription-form'){
                        new bootstrap.Modal($("#sub-modal")).toggle();
                    }else{
                        new bootstrap.Modal($("#form-modal")).toggle();
                    }
                }
                form.classList.add('was-validated')
            }, false)
    });



    //Filtering products in the catalog
    products = $('.catalog .product');

    $('input[type=radio][name=filter]').change(function() {
        
        duration = 500;

        //Show all products
        if(this.value == 'all'){
            products.show(duration);
        }
        //Show option1
        else if (this.value == 'option1') {
            products.each(function(){
                if($(this).hasClass('option1')){
                    $(this).show(duration);
                }else{
                    $(this).hide(duration);
                }
            });
        }
        //Show option2
        else if(this.value == 'option2'){
            products.each(function(){
                if($(this).hasClass('option2')){
                    $(this).show(duration);
                }else{
                    $(this).hide(duration);
                }
            });
        }
        //Show option3
        else if(this.value == 'option3'){
            products.each(function(){
                if($(this).hasClass('option3')){
                    $(this).show(duration);
                }else{
                    $(this).hide(duration);
                }
            });
        }
    });


    //Adding products to local storage
    $("#add-to-card").click(function(event){

        //Parsing JSON from local storage
        values = JSON.parse(window.sessionStorage.getItem('map'));

        if(values == null){
            map = new Map();
        }else{
            map = new Map(Object.entries(values));
        }

        // Get data about product
        productId = $("#product-info").attr("data-product-id");
        productPrice = $("#product-info").attr("data-price");
        prodcutName = $("h1").text();
        src = "../images/product" + productId + "-min.webp";

        // Save new product t the map
        if(map.has(productId)){
            obj = map.get(productId);
            obj.quantity = obj.quantity + 1;
            console.log(obj);
            map.set(productId, obj);
            console.log(obj);
        }else{
            obj = new Order();
            obj.id = productId;
            obj.name = prodcutName;
            obj.src = src;
            obj.quantity = 1;
            obj.price = productPrice;
            map.set(productId, obj);
            console.log(obj);
        }

        //Saving JSON to local storage with new product
        window.sessionStorage.setItem('map', JSON.stringify(Object.fromEntries(map)));

        // Udate card for the user
        updateCard();

        new bootstrap.Modal($("#added")).toggle();
    }); 

    // Order class that stores info about order
    class Order {
        id;
        quantity;
        price;
        src;
        name;
    }

    //On click remove products from card
    $("#remove-app").click(function(){
        clearStorage();
    });


    //Update card and update checkout page every time the page loads
    updateCard();
    updateCheckoutPage();

    //Clear storage function
    function clearStorage(){
        window.sessionStorage.setItem('map', '{}');
        location.reload();
    };

    //Update card function
    function updateCard() {
        counter = 0;

        values = JSON.parse(window.sessionStorage.getItem('map'));

        if(values == null){
            return;
        }else{
            map = new Map(Object.entries(values));
        }

        map.forEach(value => {
            counter += value.quantity; 
        });

        $('#quantity').text(counter);
    }

    //Update checkout page 
    function updateCheckoutPage() {
        counter = 0;
        total = 0;

        // No items have been added
        if(jQuery.isEmptyObject(values)){
            $("#summary").append(
                "<div class=\"col-12 no-items\">No items have been added yet!</div>"
            );
            $("#remove-itm-btn").hide();
            $("#checkout-btn").prop("disabled", true);
            return;
        }
        //Add all added items to page
        else{
            map = new Map(Object.entries(values));

            map.forEach(value => {
                $("#summary").append("<div class=\"col-3 mb-4\"><img src=" + value.src + " alt=\"product\"></div>");
                $("#summary").append("<div class=\"col-3 mb-4\"><p>" + value.name + "</p></div>");
                $("#summary").append("<div class=\"col-2 mb-4\"><p>" + value.quantity + "</p></div>");
                $("#summary").append("<div class=\"col-2 mb-4\"><p>€ " + value.price + "</p></div>");
                $("#summary").append("<div class=\"col-2 mb-4\"><p>€ " + (value.price * value.quantity).toFixed(2) + "</p></div>");
                total += value.price * value.quantity;
            });
            
            $("#summary").append("<div class=\"col-8 mb-4\" style=\"text-align: center;\"><button class=\"btn\" id=\"remove-itm-btn\">Remove items</button></div>");
            $("#summary").append("<div class=\"col-2 total mb-4\">Total:</div>");
            $("#summary").append("<div class=\"col-2 total mb-4\"><p>€ " + total.toFixed(2) + "</p></div>");

            $("#remove-itm-btn").click(function(event){
                new bootstrap.Modal($("#removed")).toggle();
            });
        }
    };

    //Reload page after cloasing subscription modal
    $('#sub-modal').on('hidden.bs.modal', function (e) {
        location.reload();
    });
    //Reload page after cloasing order modal
    $('#form-modal').on('hidden.bs.modal', function (e) {
        if($('#form-modal').data('key') === 'checkout'){
            window.sessionStorage.setItem('map', '{}');
        }
        location.reload();
    });
});