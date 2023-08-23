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

                <div>
                    <div class="input-item">
                        <label for="password">비밀번호</label>
                        <input type="password" id="password" v-model="originalData.password" @click="openPasswordModal" />
                    </div>

                    <!-- 모달 요소 -->
                    <div v-if="passwordModal" class="modal">
                        <div class="modal-content">
                            <h3>비밀번호 변경</h3>
                            <label for="newPassword" class="password-label">새 비밀번호</label>
                            <input type="password" id="newPassword" v-model="newPassword" @input="checkNewPassword" />
                            <span v-if="passwordValidationMessage" class="validation-message">{{ passwordValidationMessage }}</span>
                            <label for="confirmPassword" class="password-label">비밀번호 확인</label>
                            <input type="password" id="confirmPassword" v-model="confirmPassword" @click="clearPasswordMatchMessage" />
                            <span v-if="passwordMatchMessage" class="validation-message">{{ passwordMatchMessage }}</span>
                            <div class="button-group-center">
                                <button @click="changePassword">비밀번호 변경</button>
                                <button @click="closePasswordModal">취소</button>
                            </div>
                        </div>
                    </div>
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
                    <input type="text" id="phone_num" v-model="originalData.phone_num" @input="onPhoneNumChange" />
                    <span v-if="phone_check" class="validation-message">유효하지 않은 전화번호입니다.</span>
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
            passwordModal: false,
            newPassword: "",
            confirmPassword: "",
            passwordValidationMessage: "",
            passwordMatchMessage: "",
        };
    },
    created() {
        const email = localStorage.getItem("userID");
        this.fetchUserInfo(email); // 컴포넌트 생성 시 기존 데이터를 불러오는 메소드 호출
    },
    methods: {
        convertAgeRange(age) {
            if (age === "14~19" || age === "14-19") {
                return "10";
            } else if (age === "20~29" || age === "20-29") {
                return "20";
            } else if (age === "30~39" || age === "30-39") {
                return "30";
            } else if (age === "40~49" || age === "40-49") {
                return "40";
            } else if (age === "50~59" || age === "50-59") {
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

        openPasswordModal() {
            this.passwordModal = true;
        },
        closePasswordModal() {
            this.passwordModal = false;
            this.newPassword = "";
            this.confirmPassword = "";
        },
        checkNewPassword() {
            const validatePassword = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

            if (this.newPassword === "") {
                this.passwordValidationMessage = "";
            } else if (!validatePassword.test(this.newPassword)) {
                this.passwordValidationMessage = "비밀번호는 최소 8자리 이상 영문, 숫자, 특수문자가 각각 1개 이상 포함되어야 합니다.";
            } else {
                this.passwordValidationMessage = "";
            }
        },

        async changePassword() {
            if (this.newPassword === this.confirmPassword) {
                try {
                    const email = localStorage.getItem("userID");

                    const requestData = {
                        email: email,
                        updatedFields: {
                            password: this.newPassword,
                        },
                    };

                    const response = await axios.post("mypage/updateUserInfo", requestData);
                    this.message = response.data.message;

                    this.closePasswordModal();

                    //this.originalData.password = this.newPassword;

                    // 모달을 닫는 함수 호출
                    //this.closePasswordModal();

                    // newPassword와 confirmPassword 초기화
                    this.newPassword = "";
                    this.confirmPassword = "";
                } catch (error) {
                    console.error("비밀번호 변경 오류:", error);
                }
            } else {
                console.error("비밀번호가 일치하지 않습니다.");
                this.passwordMatchMessage = "비밀번호가 일치하지 않습니다.";
            }
        },
        clearPasswordMatchMessage() {
            // 비밀번호 입력 input을 클릭했을 때 메시지 초기화
            this.passwordMatchMessage = "";
        },
        checkphone() {
            const validatephone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

            if (this.originalData.phone_num === "" || !validatephone.test(this.originalData.phone_num)) {
                this.phone_check = true;
                this.error_border_check = true;
            } else {
                this.phone_check = false;
                this.error_border_check = false;
            }
        },

        formatPhoneNumber() {
            // 숫자 이외의 문자 제거
            this.originalData.phone_num = this.originalData.phone_num.replace(/[^\d]/g, "");

            const phoneNumberLength = this.originalData.phone_num.length;

            // 전화번호 길이가 10 또는 11인 경우에만 처리
            if (phoneNumberLength === 10 || phoneNumberLength === 11) {
                let pattern = "";
                if (phoneNumberLength === 10) {
                    pattern = /^01([0|1|6|7|8|9])(\d{3})(\d{4})$/;
                } else if (phoneNumberLength === 11) {
                    pattern = /^01([0|1|6|7|8|9])(\d{4})(\d{4})$/;
                }

                if (pattern.test(this.originalData.phone_num)) {
                    this.originalData.phone_num = this.originalData.phone_num.replace(pattern, "01$1-$2-$3");
                }
            }

            // 최대 입력 가능한 자리수 제한 (11자리)
            if (phoneNumberLength > 11) {
                this.originalData.phone_num = this.originalData.phone_num.slice(0, 11);
            }
        },

        // ... 기존 메소드 ...

        onPhoneNumChange() {
            this.formatPhoneNumber();
            this.checkphone();
        },
        async updateUserInfo() {
            const email = localStorage.getItem("userID");

            // POST 요청을 보내기 위한 데이터 구성
            const updatedFields = {
                email: email,
                updatedFields: {
                    add1: this.updatedFields.add1,
                    add2: this.updatedFields.add2,
                    zipcode: this.updatedFields.zipcode,
                    phone_num: this.updatedFields.phone_num,
                    password: this.originalData.password,
                },
            };

            const requestData = {
                email: email,
                updatedFields: updatedFields,
            };

            try {
                const response = await axios.post("mypage/updateUserInfo", requestData);
                this.message = response.data.message;
            } catch (error) {
                console.error("회원정보 수정 오류:", error);
                this.message = "회원정보 수정에 실패했습니다.";
            }
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
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    width: 400px;
}

.modal h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

.modal label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.modal input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.modal span {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    display: block;
}

.modal button {
    padding: 8px 15px;
    background-color: #003cff9f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.modal button + button {
    margin-left: 10px;
}
.button-group-center {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.button-group-center button {
    padding: 5px 10px;
    font-size: 16px;
}
.password-label {
    margin-top: 30px; /* 필요에 따라 이 값을 조정해보세요 */
}

.validation-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    display: block;
}
.input-item input[type="password"] {
    -webkit-text-security: disc;
    -moz-text-security: disc;
    text-security: disc;
}
</style>
