function splitText(text, limit = 100) {
  text = text.trim();
  text = text.replace('\n', '');
  let textObj;
  if (text.length > limit) {
    textSimple = text.slice(0, limit);
    textDetail = text.slice(limit);
    textObj = { simple: textSimple, detail: textDetail };
  } else {
    textObj = { simple: text, detail: '' };
  }
  return textObj;
}

document.addEventListener('DOMContentLoaded', () => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const productInfo = JSON.parse(xhr.responseText);
    const productInfoContainer = document.querySelector(
      '.productDescription .container',
    );
    const textObj = splitText(productInfo.displayInfo.productContent);
    const paragraph = document.createElement('p');
    paragraph.innerText = textObj.simple;
    productInfoContainer.appendChild(paragraph);
    if (textObj.detail) {
      function spreadEvent() {
        $('.productDescription .moreInfo').slideDown(() => {
          dotText.style.display = 'none';
        });
        spreadButton.setAttribute('class', 'open');
        spreadButton.innerHTML = foldText;
      }
      function foldEvent() {
        $('.productDescription .moreInfo').slideUp(() => {
          dotText.style.display = 'inline';
        });
        spreadButton.setAttribute('class', 'fold');
        spreadButton.innerHTML = openText;
      }
      const dotText = document.createElement('span');
      dotText.setAttribute('class', 'dots');
      dotText.innerText = '...';
      const moreText = document.createElement('span');
      moreText.setAttribute('class', 'moreInfo');
      moreText.innerText = textObj.detail;
      const spreadButton = document.createElement('button');
      const openText = "펼쳐보기 <i class='fn fn-down2'></i>";
      const foldText = "접기 <i class='fn fn-up2'></i>";
      spreadButton.innerHTML = openText;
      spreadButton.setAttribute('class', 'fold');
      paragraph.appendChild(dotText);
      paragraph.appendChild(moreText);
      $('.productDescription .moreInfo').hide();
      productInfoContainer.appendChild(spreadButton);
      spreadButton.addEventListener('click', () => {
        if (spreadButton.getAttribute('class') === 'fold') {
          spreadEvent();
        } else {
          foldEvent();
        }
      });
    }
  };
  const path = document.location.pathname;
  const displayInfoId = path.split('/')[2]; // /products/displayInfoId
  xhr.open('GET', `/api/products/${displayInfoId}`);
  xhr.send();
});
