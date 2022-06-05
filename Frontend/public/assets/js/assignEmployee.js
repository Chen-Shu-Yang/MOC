/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

function createRow(cardInfo) {
  console.log(cardInfo);
  const card = `
    <div class="card mb-3" style="max-width: 93%;">
    <div class="row no-gutters">
        <div class="col-sm-3">
            <img src="../../assets/img/profile1.jpg" class="card-img rounded-circle " alt="...">
        </div>
        <div class="col-sm-9 ">
            <div class="card-body">
                <h6 class="card-title">Card title</h6>
                <p class="card-text">This is a wider card with supporting text below as a
                    natural lead-in to additional content. This content is a little bit longer.
                </p>
            </div>
        </div>
    </div>
</div>
  `;
  return card;
}
