function addToList(formID,formWarningID) {
    var myform = document.getElementById(formID);
    var text = myform.name.value;
    var warning_p = document.getElementById(formWarningID);
    if (text == "" ){
        warning_p.innerText ="Aucun utilisateur n'a été renseigné !!!";
    }
    else{
        warning_p.innerText ="";
        console.log('send message : ',text);
        myform.submit();
    }
}