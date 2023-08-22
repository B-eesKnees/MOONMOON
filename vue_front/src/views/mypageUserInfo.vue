<template>
    <div class="mypage_menu">
        <myPageSide />
    </div>
    <div class="right_box">
        <h2 class="userUpdateTitle">회원정보 관리</h2>
        <hr class="section-divider" />

        <form @submit.prevent="updateUserInfo">
            <div class="input-group">
                <div class="input-item">
                    <label for="email">아이디</label>
                    <input type="text" id="email" v-model="originalData.email" :readonly="true" />
                </div>
                <div class="input-item">
                    <label for="name">이름</label>
                    <input type="text" id="name" v-model="originalData.name" :readonly="true" />
                </div>

                <div class="input-item">
                    <label for="password">비밀번호</label>
                    <input type="password" id="password" v-model="originalData.password" />
                </div>
                <div class="input-item">
                    <label for="sex">성별</label>
                    <input type="text" id="sex" :value="convertGender(originalData.sex)" :readonly="true" />
                </div>
                <div class="input-item">
                    <label for="age">나이대</label>
                    <input type="number" id="age" :value="convertAgeRange(originalData.age)" :readonly="true" />
                </div>
                <div class="input-item">
                    <label for="add1">주소</label>
                    <input type="text" id="add1" v-model="originalData.add1" @click="openAddressSearch" />
                </div>
                <div class="input-item">
                    <label for="add2">상세주소</label>
                    <input type="text" id="add2" v-model="originalData.add2" />
                </div>
                <div class="input-item">
                    <label for="zipcode">우편번호</label>
                    <input type="text" id="zipcode" v-model="originalData.zipcode" />
                </div>
                <div class="input-item">
                    <label for="phone_num">전화번호</label>
                    <input type="text" id="phone_num" v-model="originalData.phone_num" />
                </div>
            </div>

            <div class="button-group">
                <button type="button" @click="cancelUpdate">취소</button>
                <button type="submit">수정</button>
            </div>
        </form>
        <div v-if="message" class="status-message">{{ message }}</div>
    </div>
</template>
<script>
import axios from "axios";
import myPageSide from "../components/myPageSide.vue";

export default {
    components: { myPageSide },
    data() {
        return {
            originalData: {}, // 기존 데이터를 저장할 객체
            updateData: {}, // 수정한 데이터를 저장할 객체
            message: "",
        };
    },
    created() {
        const email = localStorage.getItem("userID");
        this.fetchUserInfo(email); // 컴포넌트 생성 시 기존 데이터를 불러오는 메소드 호출
    },
    methods: {
        convertAgeRange(age) {
            if (age === "14~19" || "14-19") {
                return "10";
            } else if (age === "20~29" || "20-29") {
                return "20";
            } else if (age === "30~39" || "30-39") {
                return "30";
            } else if (age === "40~49" || "40-49") {
                return "40";
            } else if (age === "50~59") {
                return "50";
            } else {
                return age;
            }
        },
        async fetchUserInfo(email) {
            try {
                const response = await axios.get("mypage/getUserInfo", {
                    params: { userEmail: email },
                });

                this.originalData = {
                    ...response.data,
                    //age: response.data.age, // age 프로퍼티에 값을 할당
                    ageRange: this.convertAgeRange(response.data.age), // 나이대 변환
                };

                this.updatedFields = { ...this.originalData }; // 수정할 정보를 updatedFields에 복사
            } catch (error) {
                console.error("기존 회원정보 불러오기 오류:", error);
            }
        },
        async updateUserInfo() {
            const email = localStorage.getItem("userID");

            // POST 요청을 보내기 위한 데이터 구성
            const requestData = {
                email: email,
                updatedFields: {
                    add1: this.updatedFields.add1,
                    add2: this.updatedFields.add2,
                    zipcode: this.updatedFields.zipcode,
                    phone_num: this.updatedFields.phone_num,
                    password: this.updatedFields.password,
                },
            };

            try {
                const response = await axios.post("mypage/updateUserInfo", requestData);
                this.message = response.data.message;
            } catch (error) {
                console.error("회원정보 수정 오류:", error);
                this.message = "회원정보 수정에 실패했습니다.";
            }
        },
        convertGender(genderCode) {
            if (genderCode === "f") {
                return "여자";
            } else if (genderCode === "m") {
                return "남자";
            }
        },
        openAddressSearch() {
            new daum.Postcode({
                oncomplete: (data) => {
                    if (data.userSelectedType === "R" || data.userSelectedType === "J") {
                        // 우편번호와 주소 정보를 업데이트
                        this.updatedFields.zipcode = data.zonecode;
                        this.updatedFields.add1 = data.roadAddress || data.jibunAddress;
                        this.updatedFields.add2 = ""; // 상세주소 초기화

                        // 상세주소 필드로 포커스 이동
                        document.getElementById("add2").focus();
                    }
                },
            }).open();
        },
        cancelUpdate() {
            // 수정 취소 시 원래 데이터로 초기화
            this.updatedFields = { ...this.originalData };
            this.message = ""; // 메시지 초기화
        },
    },
};
</script>
<style scoped>
.userUpdateTitle {
    font-weight: bold;
    font-size: 30px;
}
/* ... 기존 스타일 ... */

.input-group {
    display: flex;
    flex-direction: column;

    gap: 15px;
}

.input-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.input-item label {
    display: inline-block;
    width: 120px; /* 레이블의 너비 조정 */
    text-align: left;
}
.input-item input {
    flex: 1; /* 입력 필드 너비 조정 */
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    width: 100px; /* 너비를 2/5로 조절 */
    /* readonly 상태일 때의 배경색과 글자색 설정 */
    background-color: #f5f5f5; /* 배경색 */
    color: #999; /* 글자색 */
    pointer-events: none;
}
.input-item input:not([readonly]) {
    /* readonly가 아닌 input에는 배경색과 글자색을 설정하지 않음 */
    background-color: white;
    color: black;
    pointer-events: auto;
}
.button-group {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 20px;
}

.button-group button {
    padding: 5px 10px; /* 버튼의 내부 여백을 조절하여 크기를 조정 */
    font-size: 16px; /* 버튼의 폰트 크기를 조정 */
}

.status-message {
    margin-top: 10px;
    font-weight: bold;
}
.section-divider {
    margin-top: 40px;
    margin-bottom: 40px;
}
</style>
