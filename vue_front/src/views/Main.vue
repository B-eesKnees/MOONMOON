<template>
    <!-- nav구역 -->
    <div class="nav">
        <div class="nav_btn_wrap">
            <button class="nav_btn">☰</button>
        </div>
        <ul class="nav_category">
            <a class="nav_category_link" href="">
                <li>추천</li>
            </a>
            <a class="nav_category_link" href="">
                <li>베스트</li>
            </a>
            <a class="nav_category_link" href="">
                <li>신상품</li>
            </a>
            <a class="nav_category_link" href="">
                <li>이벤트</li>
            </a>
            <a class="nav_category_link" href="">
                <li>굿즈</li>
            </a>
        </ul>
        <div class="nav_sub">
            <a class="nav_sub_link" href="">마일리지</a>
            •
            <a class="nav_sub_link" href="">출석체크</a>
        </div>
    </div>

    <!-- 이미지슬라이더 -->
    <div class="image-slider">
        <div class="slider-wrapper" v-if="slidesReady">
            <div class="slider"
                :style="{ transform: `translateX(-${currentIndex * 100}%)`, transition: transitionDuration }">
                <div v-for="(image, index) in images" :key="index" class="slide">
                    <img :src="image" alt="Slide Image" />
                </div>
            </div>
            <div class="controls">
                <button @click="prevSlide" class="prev-btn">&lt;</button>
                <button @click="nextSlide" class="next-btn">&gt;</button>
            </div>
            <div class="dots">
                <span v-for="(image, index) in images" :key="index" @click="goToSlide(index)"
                    :class="{ active: index === currentIndex }" class="dot"></span>
            </div>
        </div>
    </div>
    <!-- 책추천 구역 -->
    <div class="container">
        <h2 class="recommend_title"><span class="recommend_username">ㅇㅇㅇ</span>님에게 추천하는 책이예요</h2>
        <div class="main_item_wrap">
            <div class="recommend_item" v-for="i in 8">
                <img class="main_item_img" src="../assets/img/book4.jpg" alt="">
                <div class="main_item_info">
                    <h5 class="main_item_title">제목제목</h5>
                    <span class="main_item_writer">글쓴이</span>
                    •
                    <span class="main_item_publisher">출판사</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 베스트추천 구역 -->
    <div class="container">
        <div class="best_header">
            <h2 class="main_title">베스트</h2>
            <a href="">더보기 ＋</a>
        </div>
        <div class="main_item_wrap">
            <div class="best_item" v-for="i in 5">
                <img class="main_item_img" src="../assets/img/book4.jpg" alt="">
                <div class="main_item_info">
                    <h5 class="main_item_title">제목제목</h5>
                    <span class="main_item_writer">글쓴이</span>
                    •
                    <span class="main_item_publisher">출판사</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 신상품추천 구역 -->
    <div>
        <h2>신상품</h2>
        <a href="#">더보기 +</a>
        <div>
            <div>
                <img src="" alt="">
                <div>
                    <h5>제목제목</h5>
                    <span>글쓴이</span>
                    •
                    <span>출판사</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 이벤트배너 구역 -->
    <div>
        <h3>이벤트입니다이벤트야</h3>
        <p>2023.07.24 - 2023.08.31</p>
    </div>

    <!-- 굿즈 구역 -->
    <div>
        <h2>굿즈</h2>
        <div>
            <img src="" alt="">
            <div></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            images: [
                require('../assets/img/book1.jpg'),
                require('../assets/img/book2.jpg'),
                require('../assets/img/book3.jpg'),
            ],
            currentIndex: 0,
            slidesReady: false, // 슬라이드 준비 여부 상태 추가
            transitionDuration: '0.3s', // 이미지 이동 애니메이션 시간
        };
    },
    mounted() {
        // 이미지 슬라이드가 렌더링되고 준비가 완료되면 slidesReady를 true로 설정
        this.slidesReady = true;
    },
    methods: {
        // 이전 슬라이드로 이동하는 메서드 (이미지가 오른쪽으로 넘어가는 애니메이션 추가)
        prevSlide() {
            if (this.slidesReady) {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                } else {
                    this.currentIndex = this.images.length - 1;
                }
                this.transitionDuration = '0.3s';
            }
        },
        // 다음 슬라이드로 이동하는 메서드 (이미지가 왼쪽으로 넘어가는 애니메이션 추가)
        nextSlide() {
            if (this.slidesReady) {
                if (this.currentIndex < this.images.length - 1) {
                    this.currentIndex++;
                } else {
                    this.currentIndex = 0;
                }
                this.transitionDuration = '0.3s';
            }
        },
        goToSlide(index) {
            this.currentIndex = index;
            this.transitionDuration = '0.3s';
        },
    },
};
</script>

<style>
/* 메인 공용 스타일 */
.container {
    width: 80%;
    margin: 5% auto 0 auto;
}

.main_title {
    font-size: xx-large;
    font-weight: bold;
    color: #4E4EFF;
}

.main_item_wrap {
    display: flex;
    flex-wrap: wrap;
    /* 4개 이상의 박스가 있으면 다음 줄로 넘김 */
    justify-content: space-between;
    /* 가로로 오른쪽으로 정렬 */
}

.main_item_img {
    width: 100%;
    height: 80%;
}

.main_item_info {
    padding: 5%;
}

.main_item_title {
    font-size: large;
    font-weight: bold;
}

.main_item_writer,
.main_item_publisher {
    line-height: 40px;
}


/* NAV바 */
.nav {
    width: 80%;
    height: 10vh;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
}

.nav_btn_wrap {
    width: 10%;
}

.nav_btn {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    padding: 8px 16px;
    font-weight: bold;
    font-size: large;
    background-color: white;
}

.nav_category {
    width: 30%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: -50%;
}

.nav_category_link li {
    font-size: x-large;
    font-weight: bold;
}

.nav_sub {
    width: 10%;
}


/* 이미지슬라이더 */
.image-slider {
    text-align: center;
}

.slider-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    /* 높이를 80%로 설정 */
    max-height: 800px;
    /* 최대 높이 설정 (원하는 높이 값으로 변경 가능) */
    margin: 0 auto;
    overflow: hidden;
}

.slider {
    display: flex;
    transition: transform 0.3s ease;
}

.slide {
    flex: 0 0 100%;
}

.slide img {
    width: 100%;
    height: 100%;
    /* 이미지가 슬라이드의 높이를 100% 차지하도록 설정 */
    object-fit: cover;
    /* 이미지 비율 유지하며 슬라이드에 맞추도록 설정 */
}

.image-slider button {
    border: none;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    padding: 8px 22px;
    cursor: pointer;
    font-weight: bold;
}

.image-slider button:hover {
    background-color: white;
    color: #4E4EFF;
}

.dot {
    width: 20px;
    height: 20px;
    border: 1px solid #4E4EFF;
    border-radius: 50%;
    background-color: white;
    margin: 0 5px;
    cursor: pointer;
}

.dot.active {
    background-color: #4E4EFF;
}

.controls {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.prev-btn,
.next-btn {
    border: none;
    font-size: 24px;
    cursor: pointer;
    transition: transform 0.3s ease;
    /* 애니메이션을 위한 transition 추가 */
}

.prev-btn {
    margin-left: 10px;
}

.next-btn {
    margin-right: 10px;
}

.dots {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
}


/* 책추천 */
.recommend_title {
    font-size: xx-large;
    font-weight: bold;
}

.recommend_username {
    color: #4E4EFF;
}

.recommend_item {
    width: 21%;
    margin: 2% 0 0 0;
}

/* 베스트 */
.best_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.best_header a {
    font-size: large;
    font-weight: bold;
}
.best_item {
    width: 15%;
    margin: 2% 0 0 0;
}
</style>