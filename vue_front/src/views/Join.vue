<template>
    <div class="join">
        <div class="title-bar">
            <h5>회원가입</h5>
        </div>

        <!-- 소셜로그인 -->
        <div class="wrap2">
            <form method="post">
                <div class="user_social_btns">
                    <div class="user_social_btns_p">
                        <p>소셜로 간편하게 로그인하세요</p>
                    </div>
                    <a class="social_btn" href="/naverlogin"><img class="social_btn_naver" src="../assets/img/naver.png"
                            alt=""></a>
                    <a class="social_btn" @click="kakaoLogin"><img class="social_btn_kakao" src="../assets/img/kakao.png"
                            alt=""></a>
                </div>
            </form>
        </div>

        <!-- 로컬회원가입 -->
        <div class="wrap">
            <form @submit.prevent="joinForm">
                <label for="name">이름</label>
                <input v-model="name" type="text" id="name" placeholder="이름 입력" :class="{ error_border: name_check }"
                    maxlength="25">
                <label for="email">아이디</label>
                <input v-model="emailFirst" type="text" id="email" placeholder="이메일 입력"
                    :class="{ error_border: email_check || emailcheck != 2 }" maxlength="25">
                <select v-model="emailSecond" class="email_list" name="emailList" id="emailList">
                    <option value="@naver.com">@naver.com</option>
                    <option value="@hanmail.net">@hanmail.net</option>
                    <option value="@gmail.com">@gmail.com</option>
                    <option value="@nate.com">@nate.com</option>
                    <option value="@hotmail.com">@hotmail.com</option>
                </select>
                <button type="button" @click=" startCountdown(), sendEmail()" class="email_auth">인증메일 전송</button>
                <div v-if="clickSendEmail" class="email_auth_complete">
                    <input v-model="userVerifyNum" :disabled="!email_auth_check" type="text" maxlength="6">
                    <span>{{ formattedTime }}</span>
                    <button type="button" @click="completeAuthEmail">인증완료</button>

                </div>
                <form @submit.prevent="emailCheckForm">
                    <a href="/auth/checkemail"><button type="submit" id="email_check"
                            class="username_submit">중복확인</button></a>
                </form>
                <p id="error" v-if="email_check">이메일주소를 정확히 입력해주세요. 예)abcd@naver.com</p>
                <p id="error" v-show="emailcheck == 1">존재하는 이메일입니다.</p>
                <p id="complete" v-show="emailcheck == 2 && !email_check">사용가능한 이메일입니다.</p>
                <label for="password">비밀번호</label>
                <input v-model="password" type="password" id="password" :class="{ error_border: password_check }"
                    placeholder="비밀번호 입력" maxlength="15"><br />
                <p id="error" v-if="password_check">비밀번호를 정확히 입력해주세요.<br /> *8자리 이상 영문, 숫자, 특수문자가 각각 1개 이상</p>
                <label for="password_check2">비밀번호 확인</label>
                <input v-model="password2" type="password" id="password_check" :class="{ error_border: password_check2 }"
                    placeholder="비밀번호 확인 입력"><br />
                <p id="error" v-if="password_check2">비밀번호가 일치하지 않습니다.</p>
                <div class="gender">
                    <label for="sex">성별</label>
                    <input v-model="sex" type='radio' name='gender' value='m' class="input_sex" />남자
                    <input v-model="sex" type='radio' name='gender' value='f' class="input_sex" />여자
                </div>
                <p id="error" v-if="sex_check">성별을 선택하세요.</p>
                <div class="age_range">
                    <label for="age_range">나이대</label>
                    <input v-model="agegroup" type='radio' name='agegroup' value='10' class="input_sex" />10대
                    <input v-model="agegroup" type='radio' name='agegroup' value='20' class="input_sex" />20대
                    <input v-model="agegroup" type='radio' name='agegroup' value='30' class="input_sex" />30대
                    <input v-model="agegroup" type='radio' name='agegroup' value='40' class="input_sex" />40대
                    <input v-model="agegroup" type='radio' name='agegroup' value='50' class="input_sex" />50대
                    <input v-model="agegroup" type='radio' name='agegroup' value='60' class="input_sex" />60세 이상
                </div>
                <p id="error" v-if="age_range_check">나이대를 선택하세요.</p>
                <label for="phone_num">전화번호</label>
                <input v-model="phone_num" @input="formatPhoneNumber" type="text" id="phone_num" placeholder="전화번호 입력"
                    :class="{ error_border: phone_check }" maxlength="13"><br />
                <p id="error" v-if="phone_check">전화번호를 정확히 입력해주세요.</p>
                <label for="epostNum">우편번호<span class="fontRed">*</span></label>
                <input v-model="epostNum" ref="epostNum" type="text" id="epostNum" placeholder="우편번호 입력">
                <input @click="sample6_execDaumPostcode" class="epostNumBtn" type="button" value="우편번호 검색"><br />
                <label for="epostAdress">주소<span class="fontRed">*</span></label>
                <input v-model="epostAdress" ref="epostAdress" type="text" id="epostAdress" placeholder="주소 입력"><br />
                <label for="epostDetailAdress">상세주소<span class="fontRed">*</span></label>
                <input v-model="epostDetailAdress" ref="epostDetailAdress" type="text" id="epostDetailAdress"
                    placeholder="상세주소 입력"><br />
                <!-- 가입하기버튼 -->
                <button type="submit"/><input type="submit" :class="{ 'error_submit': allcheck, 'submit': !allcheck }"
                         id="login" value="가입하기">
            </form>
        </div>
    </div>
    <!-- <Footer /> -->
</template>

<script>
// import Footer from '../components/footer.vue'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export default {
    // components: { gnbBar, Footer },
    data() {
        return {
            // 회원 입력정보
            name: '',
            email: '',
            emailFirst: '',
            emailSecond: '',
            password: '',
            password2: '',
            phone_num: '',
            sex: '',
            agegroup: '',
            epostNum: '',
            epostAdress: '',
            epostDetailAdress: '',


            name_check: true,
            email_check: false,
            password_check: false,
            password_check2: false,
            sex_check: false,
            age_range_check: false,
            phone_check: false,
            error_border_check: false,

            //이메일 인증하기
            clickSendEmail: false,
            countdown: 180,
            interval: null,
            verifyNum: '',
            userVerifyNum: '',
            email_auth_check: true,

            //주소 데이터
            epostNum: "",
            epostAdress: "",
            epostDetailAdress: "",
            epostreference: "",

            allcheck: true,
            allcheck1: true,
            allcheck2: true,
            allcheck3: true,
            allcheck4: true,
            allcheck5: true,
            allcheck6: true,
            allcheck7: true,
            emailcheck: 3,
            nicknamecheck: 3,
        };
    },
    watch: {
        'name': function () {
            this.checkName()
            this.inputAllCheck()
        },
        'emailFirst': function () {
            this.checkEmail()
            this.funcWatch()
        },
        'emailSecond': function () {
            this.checkEmail()
            this.funcWatch()
        },
        'password': function () {
            this.checkPassword()
            this.inputAllCheck()
        },
        'password2': function () {
            this.checkPassword2()
            this.inputAllCheck()
        },
        'sex': function () {
            this.checksex()
            this.inputAllCheck()
        },
        'agegroup': function () {
            this.checkage_range()
            this.inputAllCheck()
        },
        'phone_num': function () {
            this.checkphone()
            this.inputAllCheck()
        }

    },
    computed: {
        formattedTime() {
            const minutes = Math.floor(this.countdown / 60);
            const seconds = this.countdown % 60;
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        },
    },
    methods: {

        funcWatch() {
            this.emailCheckForm()
            this.inputAllCheck()
        },
        movetomain() {
            window.location.href = '/';
        },
        checkName() {
            if (this.name === '' || !this.name) {
                this.name_check = true;
                this.error_border_check = true;
                this.allcheck1 = true;
            } else {
                this.name_check = false;
                this.error_border_check = false;
                this.allcheck1 = false;
            }
        },
        checkEmail() {
            // 이메일 형식 검사
            this.email = this.emailFirst + this.emailSecond;
            const validateEmail1 = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            const validateEmail2 = /^[a-zA-Z0-9]*$/;
            console.log(this.email);
            if (this.email === '' || !validateEmail1.test(this.email) || !this.email || !validateEmail2.test(this.emailFirst)) {
                this.email_check = true;
                this.error_border_check = true;
                this.allcheck2 = true; //입력조건 안맞을시 true
            } else {
                this.email_check = false;
                this.error_border_check = false;
                this.allcheck2 = false;
            }
        },
        checkPassword() {
            // 최소 8자리 이상 영문, 숫자, 특수문자가 각각 1개 이상
            const validatePassword = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/

            if (this.password === '' || !validatePassword.test(this.password) || !this.password) {
                this.password_check = true;
                this.error_border_check = true;
                this.allcheck3 = true;
            } else {
                this.password_check = false;
                this.error_border_check = false;
                this.allcheck3 = false;
            }
        },
        checkPassword2() {
            if (this.password === this.password2) {
                this.password_check2 = false;
                this.error_border_check = false;
                this.allcheck4 = false;
            } else {
                this.password_check2 = true;
                this.error_border_check = true;
                this.allcheck4 = true;
            }
        },
        checksex() {
            if (this.sex == null) { //선택했으면
                this.allcheck5 = true;
            } else {
                this.allcheck5 = false;
            }
        },
        checkage_range() {
            if (this.agegroup == null) {
                this.allcheck6 = true;
            } else {
                this.allcheck6 = false;
            }
        },
        checkphone() {
            const validatephone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

            if (this.phone_num === '' || !validatephone.test(this.phone_num) || !this.phone_num) {
                this.phone_check = true;
                this.error_border_check = true;
                this.allcheck7 = true;
            } else {
                this.phone_check = false;
                this.error_border_check = false;
                this.allcheck7 = false;
            }
        },
        formatPhoneNumber() {
            // 숫자 이외의 문자 제거
            this.phone_num = this.phone_num.replace(/[^\d-]/g, '');
            // 하이픈(-) 삽입
            if (this.phone_num.length > 2) {
                this.phone_num = this.phone_num.replace(/^01([0|1|6|7|8|9])-?(\d{4})-?(\d{4})$/, '01$1-$2-$3');
            }
        },
        inputAllCheck() {
            if (this.allcheck1 || this.allcheck2 || this.allcheck3 || this.allcheck4 || this.allcheck5 || this.allcheck6 || this.allcheck7 || this.email_check || this.email_auth_check) { //하나라도 입력조건이 안맞을시
                this.allcheck = true; //버튼 비활성
            } else {
                this.allcheck = false;
            }
        },
        async sendEmail() {
            await axios({
                url: "http://localhost:3000/auth/sendEmail",
                method: "POST",
                data: {
                    email: this.email
                },
            }).then(async (res) => {
                this.verifyNum = res.data.verifyNum;
                console.log(res.data.verifyNum, "서버 코드");
            }).catch(error => {
                alert(error);
            })
        },
        startCountdown() {
            this.clickSendEmail = true;
            this.interval = setInterval(() => {
                if (this.countdown > 0) {
                    this.countdown--;
                } else {
                    clearInterval(this.interval); // 컴포넌트가 제거되기 전에 interval을 정리해야합니다.
                    alert('인증에 실패하였습니다.');
                    this.clickSendEmail = false;
                    this.countdown = 180;
                    this.userVerifyNum = "";
                }
            }, 1000);
        },
        completeAuthEmail() {
            console.log(this.userVerifyNum, "사용자입력 코드");
            if (this.verifyNum == this.userVerifyNum) {
                alert("인증이 완료되었습니다.");
                this.email_auth_check = false;
                this.clickSendEmail = false; //사용자입력 인증코드 초기화
                this.userVerifyNum = ""; // 인증시간 초기화
            } else {
                alert("인증번호가 일치하지 않습니다.");
                this.email_auth_check = true;
                this.clickSendEmail = false;
                this.userVerifyNum = ""; //사용자입력 인증코드 초기화
                this.countdown = 180; // 인증시간 초기화
            }
        },
        async emailCheckForm() {
            await axios({
                url: "http://localhost:3000/auth/checkemail",
                method: "POST",
                data: {
                    email: this.email,
                },
            }).then(async (res) => {
                const validateEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
                console.log(res.data);
                console.log(this.emailcheck);
                if (res.data == "사용가능한 이메일입니다." && validateEmail.test(this.email)) {
                    this.emailcheck = 2;
                } else if (res.data == "존재하는 이메일입니다.") {
                    this.emailcheck = 1;
                    this.allcheck = true;
                } else if (!this.email) {
                    this.emailcheck = 3;
                }
            }).catch(error => {
                alert(error);
            })
        },

        sample6_execDaumPostcode() { // 다음 지도API
            new daum.Postcode({
                oncomplete: function (data) {
                    // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                    var addr = ''; // 주소 변수
                    var extraAddr = ''; // 참고항목 변수

                    //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                        addr = data.roadAddress;
                    } else { // 사용자가 지번 주소를 선택했을 경우(J)
                        addr = data.jibunAddress;
                    }

                    // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                    if (data.userSelectedType === 'R') {
                        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                            extraAddr += data.bname;
                        }
                        // 건물명이 있고, 공동주택일 경우 추가한다.
                        if (data.buildingName !== '' && data.apartment === 'Y') {
                            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                        if (extraAddr !== '') {
                            extraAddr = ' (' + extraAddr + ')';
                        }
                    }

                    // 우편번호와 주소 정보를 해당 필드에 넣는다.
                    document.getElementById('epostNum').value = data.zonecode;
                    document.getElementById("epostAdress").value = addr;
                    // 커서를 상세주소 필드로 이동한다.
                    document.getElementById("epostDetailAdress").focus();
                }
            }).open();
        },
        async joinForm() { //백엔드로 회원가입 정보 전달
            if (this.email_auth_check == true || this.allcheck == true) {
                alert("회원정보를 다시 입력하세요.");
            } else {
                await axios({
                    url: "http://localhost:3000/auth/join",
                    method: "POST",
                    data: {
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        sex: this.sex,
                        agegroup: this.agegroup,
                        phone: this.phone_num,
                        zipcode: this.epostNum,
                        add1: this.epostAdress,
                        add2: this.epostDetailAdress
                    },
                }).then(async (res) => {
                    alert(res.data.message);
                }).catch(error => {
                    alert(error);
                })
            }

        },
        async autoLogin() {
            await axios({
                url: "http://localhost:3000/auth/login",
                method: "POST",
                data: {
                    email: this.email,
                    password: this.password,
                },
            }).then(async (res) => {
                if (res.data.code == 200) {
                    localStorage.setItem("userID", res.data.email);
                    localStorage.setItem("userNick", res.data.nick);
                    localStorage.setItem("userProvider", res.data.provider);

                    window.location.href = "/";
                }
            }).catch((error) => {
                alert(error);
            });
        },
    },
}
</script> 

<style scoped>
/* 공용 CSS */
.fontRed {
    color: red;
}


/* 회원가입 */
.join {
    padding-top: 5%;
    width: 100%;
    height: 80vh;
    margin: 0;
    background-color: white;
    font-family: arial;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.title-bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #333333;
    font-size: 30px;
    padding-bottom: 10px;
    position: relative;
}

.title-bar h5 {
    margin: 24px 0;
    font-size: x-large;
    font-weight: bold;
}


/* 소셜로그인 */
.wrap2 {
    background-color: #ffffff;
    padding: 0 2%;
    width: 35%;
    min-width: 350px;
    margin: 0 auto;
    border-radius: 6px;
}

.user_social_btns {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 2%;
    margin: 0 auto 2% auto;
}

.user_social_btns_p {
    width: 80%;
    font-size: large;
    color: #333333;
}

.social_btn {
    width: 15%;
}


/* 로컬회원가입 */
.wrap {
    background-color: #ffffff;
    padding: 1%;
    width: 35%;
    min-width: 350px;
    margin: 0 auto;
    border-radius: 6px;
    border: 1px solid #fff;
}

.email_auth {
    width: 17%;
    padding: 1% 2%;
    border: 1px solid #4E4EFF;
    border-radius: 4px;
    color: white;
    background-color: #4E4EFF;
    margin-left: 2%;
}

.email_auth_complete {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
}

.email_auth_complete span {
    position: absolute;
    top: 18%;
    right: 20%;
    color: red;
    padding: 1%;
}

.email_auth_complete input {
    width: 20%;
}

.email_auth_complete button {
    width: 17%;
    padding: 1% 2%;
    border: 1px solid #4E4EFF;
    border-radius: 4px;
    color: white;
    background-color: #4E4EFF;
    margin-left: 2%;
    margin-right: 0.5%;
}

.email_list {
    width: 29%;
    padding: 1%;
    border-radius: 6px;
    border: 1px solid #efefef;
    font-size: 15px;
    margin-left: 1%;
}

#email {
    width: 30%;
}

label {
    margin-right: 3%;
    display: inline-block;
    width: 110px;
    text-align: right;
}

input {
    width: 60%;
    margin-bottom: 1%;
    padding: 1%;
    border-radius: 6px;
    border: 1px solid #efefef;
    font-size: 15px;
    transition: all .2s ease-in-out;
}



.username_submit {
    font-size: 14px;
    background-color: #4E4EFF;
    color: white;
    width: 15%;
    margin-left: 5%;
    border-radius: 4px;
    border: none;
    display: none;
}

input:focus {
    outline: none;
    border-color: #4E4EFF;

    transition: all .2s ease-in-out;
}

input.submit {
    width: 100%;
    padding: 3%;
    border-radius: 6px;
    border: 1px solid #4E4EFF;
    font-size: 15px;
    background-color: #4E4EFF;
    color: #fff;
    margin-top: 25px;
    transition: all .2s ease-in-out;
}

input.submit:hover {
    width: 100%;
    padding: 3%;
    border-radius: 6px;
    font-size: 15px;
    color: #fff;
    margin-top: 25px;
    transition: all .2s ease-in-out;
}

.gender,
.age_range {
    width: 100%;
    display: block;
    justify-content: center;
    align-items: center;
    padding: 1%;
    margin-left: -1%;
    font-size: 14px;

}

.input_sex {
    width: 14px;
    height: 14px;
    transition: all .2s ease-in-out;
}

.epostNumBtn {
    width: 20%;
    margin-left: 2%;
    background-color: #4E4EFF;
    color: #fff;
    cursor: pointer;
}

#epostNum {
    width: 20%;
}

#error {
    color: red;
    margin-bottom: 2%;
    margin-left: 24%;
    font-size: 12px;
}

#complete {
    color: #4E4EFF;
    margin-bottom: 2%;
    margin-left: 24%;
    font-size: 12px;
}

.error_border:focus {
    border-color: red;
    box-shadow: none;
}

.error_submit {
    width: 60%;
    padding: 3%;
    border-radius: 6px;
    border: 1px solid #4E4EFF;
    font-size: 15px;
    background-color: #4E4EFF;
    color: white;
    margin-left: 20%;
    margin-top: 25px;
    transition: all .2s ease-in-out;
}
</style>
