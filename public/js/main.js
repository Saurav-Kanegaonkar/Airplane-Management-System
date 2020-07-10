$(function(){
    $("#form-register").validate({
        rules: {
            password : {
                required : true,
                minlength: 1
            },
            confirm_password: {
                equalTo: "#password"
            },
            age :{
                required : true,
            }
        },
        messages: {
            username: {
                required: "Please provide an username"
            },
            email: {
                required: "Please provide an email"
            },
            password: {
                required: "Please provide a password"
            },
            confirm_password: {
                required: "Please provide a password",
                equalTo: "Please enter the same password"
            },
            card_number: {
                required: "Please provide an email"
            }
        }
    });
    $("#form-total").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        // enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate : '<div class="title">#title#</div>',
        labels: {
            previous : '<i class="fas fa-arrow-left"></i>',
            next : '<i class="fas fa-arrow-right"></i>',
            current : ''
        },
        onStepChanging: function (event, currentIndex, newIndex) { 
            if(newIndex == 2){
                var table = document.getElementById("myTable");
                var x = document.getElementById("ok").value;
                var x = parseInt(x,10); 
                var a = document.getElementsByClassName('gender');
                var j=0;
                for(var i=1; i<=x; i++){
                    if(document.getElementsByClassName('fname').item(i-1).value){
                        var row = table.insertRow(i);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        cell1.innerHTML = i;
                        cell2.innerHTML = document.getElementsByClassName('fname').item(i-1).value;
                        cell3.innerHTML = document.getElementsByClassName('lname').item(i-1).value;
                        if(a.item(j).checked){
                            cell4.innerHTML = "Male";
                        }
                        else if(a.item(j+1).checked){
                            cell4.innerHTML = "Female";
                        }
                        else{
                            cell4.innerHTML = "Others";
                        }
                        j = j+3;
                        cell5.innerHTML = document.getElementsByClassName('age').item(i-1).value;
                    }
                }
                while(table.getElementsByTagName("tr").length - x != 1){
                    document.getElementById("myTable").deleteRow(-1);
                }
                if (document.getElementById('eco').checked) {
                    var paisa = document.getElementById('eco').value;
                    var cls = "Economy"; 
                }
                else{
                    var paisa = document.getElementById('busi').value;
                    var cls = "Business"; 
                }
                var cost = document.getElementById("cost");
                paisa = x*paisa;
                cost.innerHTML = paisa + " -" + cls;
            }
            
            $("#form-register").validate().settings.ignore = ":disabled,:hidden";
            return $("#form-register").valid();
        }
    });
});
