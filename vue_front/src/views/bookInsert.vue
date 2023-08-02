<template>
  <div class="input_book_title">
    <form class="book_title_form" @submit.prevent="book_research">
      <input
        type="text"
        class="book_title"
        v-model="bookname"
        placeholder="Enter book name"
      />
      <button type="submit">검색</button>
    </form>
  </div>
  <div class="book_info">
    <img v-if="book_image" :src="book_image" class="book_image" />
    <p v-else>이미지없음</p>
    <p>이미지 제공 api: {{ book_provider }}</p>
    <h6>책 이름: {{ book_title }}</h6>
    <h6>작가: {{ book_author }}</h6>
    <h6>정가: {{ book_pricestandard }}</h6>
    <h6>세일가: {{ book_pricesales }}</h6>
    <h6>카테고리: {{ book_categoryname }}</h6>
    <h6>포인트: {{ book_point }}</h6>
    <h6>출판사: {{ book_publisher }}</h6>
    <h6>출판일: {{ book_pubdate }}</h6>
    <h6>알라딘 판매 지수: {{ book_salesPoint }}</h6>
    <h6>책 한줄 설명: {{ book_description }}</h6>
    <button type="button" @click="insertBookInfo">db 삽입</button>
  </div>

  <div v-if="bookResults.length > 0" class="book_selection">
    <label for="selectedBook">Select a book:</label>
    <select v-model="selectedBook" @change="onBookSelectionChange">
      <option value="default">-----------------------</option>
      <option v-for="(book, index) in bookResults" :key="index" :value="index">
        {{ book.title }}
      </option>
    </select>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export default {
  data() {
    return {
      bookname: "",
      email: "",
      password: "",
      provider: "",
      book_title: "",
      book_cover: "",
      book_author: "",
      book_pubdate: "",
      book_pricesales: "",
      book_pricestandard: "",
      book_categoryname: "",
      book_point: "",
      book_publisher: "",
      bookResults: [],
      naverResults: [],
      selectedBook: null,
      book_provider: "",
      book_image: "",
      book_salesPoint: "",
      book_description: "",
    };
  },
  methods: {
    book_research() {
      //검색 시 입력창에 있는 걸로 알라딘 api 검색 실시합니다.
      axios({
        url: "/aladin/getInfo",
        method: "POST",
        data: {
          bookname: this.bookname, //서버으로 넘깁니다.
        },
      })
        .then((res) => {
          let aladinXml = [];
          aladinXml = res.data; //서버에서 json으로 검색 결과를 넘긴걸 변수에 넣습니다.
          //   console.log(aladinXml.object.totalResults._text);
          //   console.log(aladinXml.object.item.title._text);
          if (aladinXml.object.totalResults._text == 0) {
            alert("검색결과가 없습니다.");
            this.bookResults = [];
            this.selectedBook = "default";
            return;
          }

          if (aladinXml.object.item.length == undefined) {
            this.bookResults.push({
              title: aladinXml.object.item.title._text,
              image: aladinXml.object.item.cover._text,
              author: aladinXml.object.item.author._text,
              priceStandard: aladinXml.object.item.priceStandard._text,
              category: aladinXml.object.item.categoryName._text,
              isbn: aladinXml.object.item.isbn13._text,
              itemID: aladinXml.object.item._attributes.itemId,
              priceSales: aladinXml.object.item.priceSales._text,
              pubDate: aladinXml.object.item.pubDate._text,
              point: aladinXml.object.item.mileage._text,
              publisher: aladinXml.object.item.publisher._text,
              salesPoint: aladinXml.object.item.salesPoint._text,
              description: aladinXml.object.item.description._text,
            });
          } else {
            if (aladinXml.object.item) {
              //검색 결과가 있으면
              this.bookResults = aladinXml.object.item.map((item) => ({
                //배열에 넣어줍니다.
                title: item.title._text,
                image: item.cover._text,
                author: item.author._text,
                priceStandard: item.priceStandard._text,
                category: item.categoryName._text,
                isbn: item.isbn13._text,
                itemID: item._attributes.itemId,
                priceSales: item.priceSales._text,
                pubDate: item.pubDate._text,
                point: item.mileage._text,
                publisher: item.publisher._text,
                salesPoint: item.salesPoint._text,
                description: item.description._text,
              }));
              this.selectedBook = "default"; //이건 왜 안될까요?
            } else {
              //검색결과가 없으면 선택창 작동안하게 합니다.
              this.bookResults = [];
              this.selectedBook = "default";
            }
          }
        })
        .catch((err) => {
          //에러처리
          console.log(err);
        });
    },
    onBookSelectionChange() {
      //select창에서 선택을 하게 되면 이 메소드가 실행됩니다.
      if (this.selectedBook === "default") {
        return;
      }

      if (this.selectedBook !== null) {
        const selectedBookData = this.bookResults[this.selectedBook]; //배열에서 select에서 선택한걸로 index를 받습니다.
        this.book_title = selectedBookData.title;
        this.book_author = selectedBookData.author;
        this.book_pricestandard = selectedBookData.priceStandard;
        this.book_categoryname = selectedBookData.category;
        this.book_pubdate = selectedBookData;
        this.book_pricesales = selectedBookData.priceSales;
        this.book_pubdate = selectedBookData.pubDate;
        this.book_point = selectedBookData.point;
        this.book_publisher = selectedBookData.publisher;
        this.book_salesPoint = selectedBookData.salesPoint;
        this.book_description = selectedBookData.description;
        if (selectedBookData.itemID) {
          //itemID을 이용하여 알라딘 api를 사용하여 책 이미지를 받습니다.
          axios({
            url: "aladin/naverBookImage",
            method: "POST",
            data: {
              isbn: selectedBookData.isbn,
              itemID: selectedBookData.itemID, //select로 선택한 것의 itemID을 서버로 넘깁니다. itemID는 알라딘의 고유 상품 번호입니다.
            },
          })
            .then((res) => {
              const aladinData = res.data;
              this.book_image = aladinData; //알라딘은 왤캐 이미지 해상도를 거지같이 주는거지
              this.book_provider = "naver";
            })
            .catch((err) => {
              axios({
                url: "aladin/aladinBookImage",
                method: "POST",
                data: {
                  itemID: selectedBookData.itemID,
                },
              })
                .then((res) => {
                  const aladinData = res.data;
                  this.book_image = aladinData.item[0].cover;
                  this.book_provider = "aladin";
                })
                .catch((err) => {
                  alert(err);
                });
            });
        } else {
          alert("이 에러가 왜나?"); //책 세트면 에러가 납니다..
        }
      }
    },
    insertBookInfo() {
      if (!this.book_title) {
        alert("책을 선택하세요");
        return;
      }
      axios({
        url: "aladin/insertInfo",
        method: "POST",
        data: {
          book_title: this.book_title,
          book_cover: this.book_image,
          book_author: this.book_author,
          book_pubdate: this.book_pubdate,
          book_pricesales: this.book_pricesales,
          book_pricestandard: this.book_pricestandard,
          book_categoryname: this.book_categoryname,
          book_point: this.book_point,
          book_publisher: this.book_publisher,
          book_salesPoint: this.book_salesPoint,
          book_description: this.book_description,
        },
      })
        .then((res) => {
          if (res.status == 200) {
            alert(res.data);
          }
        })
        .catch((err) => {
          alert(err.response.data);
        });
    },
  },
};
</script>

<style scoped>
.input_book_title {
  margin-bottom: 20px;
}

.book_title_form {
  display: flex;
  align-items: center;
}

.book_title {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
}

.book_info {
  margin-bottom: 20px;
}

.book_image {
  max-height: 300px;
  width: auto;
  display: block;
  margin-bottom: 10px;
}

.book_selection {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  margin-right: 8px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
