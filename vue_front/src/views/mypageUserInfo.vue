<template>
    <div class="mypage_menu">
        <myPageSide />
    </div>
    <div class="right_box">
        <h2 class="userUpdateTitle">회원정보 관리</h2>
        <hr style="margin-top: 30px; margin-bottom: 50px" />

        <form @submit.prevent="updateUserInfo">
            <div class="input-group">
                <label for="email">아이디</label>
                <input type="text" id="email" v-model="updatedFields.email" :readonly="true" />
            </div>
            <div>
                <label for="name">이름</label>
                <input type="text" id="name" v-model="updatedFields.name" :readonly="true" />
            </div>
            <div>
                <label for="password">비밀번호</label>
                <input type="password" id="password" v-model="updatedFields.password" />
            </div>
            <div>
                <label for="password">새 비밀번호</label>
                <input type="password" id="password" v-model="updatedFields.password" />
            </div>
            <div>
                <label for="sex">성별</label>
                <input type="text" id="sex" v-model="updatedFields.sex" :readonly="true" />
            </div>
            <div>
                <label for="age">나이</label>
                <input type="number" id="age" v-model="updatedFields.age" :readonly="true" />
            </div>
            <div>
                <label for="add1">주소</label>
                <input type="text" id="add1" v-model="updatedFields.add1" @click="openAddressSearch" />
            </div>
            <div>
                <label for="add2">상세주소</label>
                <input type="text" id="add2" v-model="updatedFields.add2" />
            </div>
            <div>
                <label for="zipcode">우편번호</label>
                <input type="text" id="zipcode" v-model="updatedFields.zipcode" />
            </div>
            <div>
                <label for="phone_num">전화번호</label>
                <input type="text" id="phone_num" v-model="updatedFields.phone_num" />
            </div>

            <div>
                <button type="button" @click="cancelUpdate">취소</button>
                <button type="submit">수정</button>
            </div>
        </form>
        <div v-if="message">{{ message }}</div>
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
            updatedFields: {
                email: "",
                name: "",
                password: "",
                sex: "",
                age: 0,
                add1: "",
                add2: "",
                zipcode: "",
                phone_num: "",
                provider: "",

                password_check: false,
                password_check2: false,
                phone_check: false,
            },
            message: "",
        };
    },
    created() {
        const email = localStorage.getItem("userID");
        this.fetchUserInfo(email); // 컴포넌트 생성 시 기존 데이터를 불러오는 메소드 호출
    },
    methods: {
        // 연령대 정보 변환 함수
        convertAgeRange(ageRange) {
            if (ageRange.includes("~")) {
                const ageRangeParts = ageRange.split("~");
                return `${ageRangeParts[0]}대`;
            }
            return ageRange;
        },
        async fetchUserInfo(email) {
            try {
                const response = await axios.get("mypage/getUserInfo", {
                    params: { userEmail: email },
                });
                this.originalData = {
                    ...response.data,
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
</style>
