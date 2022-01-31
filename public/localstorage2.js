const myform = document.querySelector('#myform');

myform.addEventListener('submit',async function () {
    formData = new FormData(myform);
    const arrEl = document.querySelector('#arr');
    const arr = getLocalstorage();
    if (arr !== null) {
        arrEl.value = JSON.stringify(arr);
    }
});
