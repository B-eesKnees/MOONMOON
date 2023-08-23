<style scoped src="bootstrap/dist/css/bootstrap.css"></style>
<style scoped src="../assets/css/sbadmin.css"></style>


<template>
    <body id="page-top">

        <!-- Page Wrapper -->
        <div id="wrapper">

            <!-- Sidebar -->
            <SideBar />
            <!-- End of Sidebar -->
            <!-- Content Wrapper -->
            <div id="content-wrapper" class="d-flex flex-column">

                <!-- Main Content -->
                <div id="content">

                    <!-- Topbar -->
                    <nav
                        class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow d-flex align-items-center justify-content-center">
                        <h1 class="">MOONMOON</h1>
                    </nav>
                    <!-- End of Topbar -->

                    <!-- Begin Page Content -->
                    <div class="container-fluid">

                        <!-- Page Heading -->
                        <div class="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 class="h3 mb-0 text-gray-800">회원 분석</h1>
                        </div>

                        <!-- Content Row -->
                        <div class="row d-flex align-items-center justify-content-center">

                            <!-- Earnings (Monthly) Card Example -->
                            <div class="col-lg-2 col-md-6 mb-4">
                                <div class="card border-bottom-primary shadow h-100">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                    남성 회원수</div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                                    {{ formatNumber(userSex.female) }}명</div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-user fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Earnings (Monthly) Card Example -->
                            <div class="col-lg-2 col-md-6 mb-4">
                                <div class="card border-bottom-danger shadow h-100">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                                    여성 회원수</div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                                    {{ formatNumber(userSex.male) }}명
                                                </div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-user fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Earnings (Monthly) Card Example -->


                        </div>

                        <div class="row d-flex align-items-center justify-content-center pb-5">
                            <!-- Pie Chart -->
                            <div class="col-xl-6 col-lg-5">
                                <div class="card shadow mb-4">
                                    <!-- Card Header - Dropdown -->
                                    <div
                                        class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-primary">성별 분포</h6>
                                    </div>
                                    <!-- Card Body -->
                                    <div class="card-body">
                                        <div class="chart-area">
                                            <!-- 성별 도넛차트 -->
                                            <canvas ref="myChart"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="border border-secondary mb-5"></div>

                        <div class="row d-flex align-items-center justify-content-center">
                            <div v-for="i in 6" :key="i" class="mb-4" style="width: 9%;">
                                <div class="card shadow h-100 mb-5" :class="{
                                    'cardshadow h-100 mb-5 border-bottom-danger': i === 1,
                                    'cardshadow h-100 mb-5 border-bottom-secondary': i === 2,
                                    'cardshadow h-100 mb-5 border-bottom-warning': i === 3,
                                    'cardshadow h-100 mb-5 border-bottom-primary': i === 4,
                                    'cardshadow h-100 mb-5 border-bottom-info': i === 5,
                                    'cardshadow h-100 mb-5 border-bottom-success': i === 6,
                                }">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-secondary text-uppercase mb-1"
                                                    :class="{
                                                        'text-danger': i === 1,
                                                        'text-secondary': i === 2,
                                                        'text-warning': i === 3,
                                                        'text-primary': i === 4,
                                                        'text-info': i === 5,
                                                        'text-success': i === 6,
                                                    }">
                                                    {{ i }}0대
                                                </div>
                                                <div class="row no-gutters align-items-center">
                                                    <div class="col-auto">
                                                        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                            {{ formatNumber(ageArangeData[i - 1][i === 1 ? 'teenagers' : i
                                                                === 2 ? 'twenties' : i === 3 ? 'thirties' : i === 4 ? 'forties'
                                                                    : i === 5 ? 'fifties' : 'sixties']) }}명</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="progress progress-sm mr-2">
                                                            <div class="progress-bar bg-warning" role="progressbar"
                                                                style="width: 50%" aria-valuenow="50" aria-valuemin="0"
                                                                aria-valuemax="100"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-user fa-xl text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="row d-flex align-items-center justify-content-center pb-5">

                            <!-- Pie Chart -->
                            <div class="col-xl-6 col-lg-5">
                                <div class="card shadow mb-4">
                                    <!-- Card Header - Dropdown -->
                                    <div
                                        class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-primary">나이대 분포</h6>
                                    </div>
                                    <!-- Card Body -->
                                    <div class="card-body">
                                        <div class="chart-area">
                                            <!-- 나이대 파이차트 -->
                                            <canvas ref="myChart2"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="border border-secondary mb-5"></div>

                        <!-- Content Row -->
                        <div class="row d-flex align-items-center justify-content-center">
                            <div class="col-lg-2 col-md-6 mb-4">
                                <div class="card border-bottom-secondary shadow h-100">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                                                    주간 방문자 수
                                                </div>
                                                <div class="row no-gutters align-items-center">
                                                    <div class="col-auto">
                                                        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                            {{ formatNumber(toDayVisit) }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="progress progress-sm mr-2">
                                                            <div class="progress-bar bg-warning" role="progressbar"
                                                                style="width: 50%" aria-valuenow="50" aria-valuemin="0"
                                                                aria-valuemax="100"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-eye fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row d-flex align-items-center justify-content-center">
                            <!-- Area Chart -->
                            <div class="col-xl-8 col-lg-7">
                                <div class="card shadow mb-4">
                                    <!-- Card Header - Dropdown -->
                                    <div
                                        class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-primary">주간 방문자</h6>

                                    </div>
                                    <!-- Card Body -->
                                    <div class="card-body">
                                        <div class="chart-area d-flex align-items-center justify-content-center">
                                            <canvas ref="dailySalesChart" width="1000" height="300"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Content Row -->
                        <div class="row">

                            <!-- Content Column -->
                            <div class="col-lg-6 mb-4">

                                <!-- Project Card Example -->
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">공지사항</h6>
                                    </div>
                                    <div class="card-body">
                                        <h4 class="small font-weight-bold ">10월 23일 페이지 점검 <span
                                                class="badge bg-danger">필독</span></h4>
                                        <div class="progress mb-4">
                                            <div class="progress-bar bg-danger" role="progressbar" style="width: 20%"
                                                aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <h4 class="small font-weight-bold">금일 13:00 ~ 14:00 전기점검으로 인해 정전 예정</h4>
                                        <div class="progress mb-4">
                                            <div class="progress-bar bg-warning" role="progressbar" style="width: 40%"
                                                aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <h4 class="small font-weight-bold">곧 종강 <span class="badge bg-danger">필독</span></h4>
                                        <div class="progress mb-4">
                                            <div class="progress-bar" role="progressbar" style="width: 60%"
                                                aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>

                                    </div>
                                </div>



                            </div>

                            <div class="col-lg-6 mb-4">

                                <!-- Illustrations -->
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">미완료 주문</h6>
                                    </div>
                                    <div class="card-body d-flex flex-column">
                                        <a href="/admin/ordermanage" v-for="(item, i) in orderData"
                                            class="small font-weight-bold mb-2">주문번호 : {{ item.ORDER_ID }} - <span
                                                class="badge bg-danger">미완료</span></a>

                                    </div>
                                </div>

                                <!-- Approach -->
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">미완료 문의</h6>
                                    </div>
                                    <div class="card-body d-flex flex-column">
                                        <a href="/admin/qnamanage" v-for="(item, i) in qnaData" :key="i"
                                            class="small font-weight-bold mb-2">{{ item.QNA_TITLE }} - <span
                                                class="badge bg-danger">미완료</span></a>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    <!-- /.container-fluid -->

                </div>
                <!-- End of Main Content -->

                <!-- Footer -->
                <footer class="sticky-footer bg-white">
                    <div class="container my-auto">
                        <div class="copyright text-center my-auto">
                            <span>Copyright &copy; Your Website 2023</span>
                        </div>
                    </div>
                </footer>
                <!-- End of Footer -->

            </div>
            <!-- End of Content Wrapper -->

        </div>
        <!-- End of Page Wrapper -->

        <!-- Scroll to Top Button-->
        <a class="scroll-to-top rounded" href="#page-top">
            <i class="fas fa-angle-up"></i>
        </a>

    </body>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import Chart from 'chart.js/auto';
import 'bootstrap'; // Import Bootstrap JavaScript
import 'chartjs-adapter-luxon';
import SideBar from '../components/adminSidebar.vue';
import axios from 'axios';

export default {
    components: { SideBar },
    data() {
        return {
            //유저 나이대
            ageArangeData: [
                {
                    id: 1,
                    teenagers: 0,
                },
                {
                    id: 2,
                    twenties: 0,
                },
                {
                    id: 3,
                    thirties: 0,
                },
                {
                    id: 4,
                    forties: 0,
                },
                {
                    id: 5,
                    fifties: 0,
                },
                {
                    id: 6,
                    sixties: 0,
                },
            ],
            //매출
            weekSales: {
                today: "",
                yesday: "",
                twoDayAgo: "",
                threeDayAgo: "",
                fourDayAgo: "",
                fiveDayAgo: "",
            },
            //오늘 포함 일주일전까지의 날짜
            dateRange: [],

            //오늘 방문자수
            toDayVisit: 0,
            userCount: 0,

            //미완료 문의
            qnaData: [],

            //미완료 주문
            orderData: [],
        }
    },
    setup() {
        const myChart = ref(null);
        const myChartAge = ref(null);
        const dailySalesChart = ref(null);

        // 데이터를 reactive로 정의
        const userSex = reactive({
            female: 0,
            male: 0,
        });
        const ageArangeData = reactive(
            [
                {
                    id: 1,
                    teenagers: 0,
                },
                {
                    id: 2,
                    twenties: 0,
                },
                {
                    id: 3,
                    thirties: 0,
                },
                {
                    id: 4,
                    forties: 0,
                },
                {
                    id: 5,
                    fifties: 0,
                },
                {
                    id: 6,
                    sixties: 0,
                },
            ]
        );


        // 데이터를 업데이트하는 함수 정의
        const updateUserSex = async () => {
            try {
                const response = await axios.post('http://localhost:3000/admin/adminUserLatest', {});
                const data = response.data;


                // 회원수를 저장
                userSex.female = data.filter(item => item.USER_SEX === 'f').length;
                userSex.male = data.filter(item => item.USER_SEX === 'm').length;

                //회원 나이대를 저장
                ageArangeData[0].teenagers = data.filter(item => item.USER_AGEGROUP === "10").length;
                ageArangeData[1].twenties = data.filter(item => item.USER_AGEGROUP === "20").length;
                ageArangeData[2].thirties = data.filter(item => item.USER_AGEGROUP === "30").length;
                ageArangeData[3].forties = data.filter(item => item.USER_AGEGROUP === "40").length;
                ageArangeData[4].fifties = data.filter(item => item.USER_AGEGROUP === "50").length;
                ageArangeData[5].sixties = data.filter(item => item.USER_AGEGROUP === "60").length;
                // 차트를 다시 그리는 함수 호출
                drawUserChart(); // 성별 차트
                drawUserArangeChart(); // 나이대 차트
            } catch (error) {
                alert(error);
            }
        };

        const weekSales = reactive({
            today: "",
            yesday: "",
            twoDayAgo: "",
            threeDayAgo: "",
            fourDayAgo: "",
            fiveDayAgo: "",
        });
        // 데이터를 reactive로 정의
        const dateRange = reactive([]);

        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            // 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            // dateRange 배열에 reactive 요소로 추가
            dateRange.push(formattedDate);
        }

        // 데이터를 업데이트하는 함수 정의
        const updateSales = async () => {
            try {
                const response = await axios.post('http://localhost:3000/admin/adminDaySales', {
                    date_start: dateRange[0] + " 00:00:00",
                    date_end: dateRange[0] + " 23:59:59",
                });
                const res = response.data;

                weekSales.today = res[0].daySales;
                console.log(res, "이거이거")

                // 차트를 다시 그리는 함수 호출
                drawSalesChart();
            } catch (error) {
                alert(error);
            }

            try {
                const response = await axios.post('http://localhost:3000/admin/adminDaySales', {
                    date_start: dateRange[1] + " 00:00:00",
                    date_end: dateRange[1] + " 23:59:59",
                });
                const res = response.data;

                weekSales.yesday = res[0].daySales;
                console.log(res, "이거이거")

                // 차트를 다시 그리는 함수 호출
                drawSalesChart();
            } catch (error) {
                alert(error);
            }

            try {
                const response = await axios.post('http://localhost:3000/admin/adminDaySales', {
                    date_start: dateRange[2] + " 00:00:00",
                    date_end: dateRange[2] + " 23:59:59",
                });
                const res = response.data;

                weekSales.twoDayAgo = res[0].daySales;
                console.log(res, "이거이거")

                // 차트를 다시 그리는 함수 호출
                drawSalesChart();
            } catch (error) {
                alert(error);
            }

            try {
                const response = await axios.post('http://localhost:3000/admin/adminDaySales', {
                    date_start: dateRange[3] + " 00:00:00",
                    date_end: dateRange[3] + " 23:59:59",
                });
                const res = response.data;

                weekSales.threeDayAgo = res[0].daySales;
                console.log(res, "이거이거")

                // 차트를 다시 그리는 함수 호출
                drawSalesChart();
            } catch (error) {
                alert(error);
            }

            try {
                const response = await axios.post('http://localhost:3000/admin/adminDaySales', {
                    date_start: dateRange[4] + " 00:00:00",
                    date_end: dateRange[4] + " 23:59:59",
                });
                const res = response.data;

                weekSales.fourDayAgo = res[0].daySales;
                console.log(res, "이거이거")

                // 차트를 다시 그리는 함수 호출
                drawSalesChart();
            } catch (error) {
                alert(error);
            }

            try {
                const response = await axios.post('http://localhost:3000/admin/adminDaySales', {
                    date_start: dateRange[5] + " 00:00:00",
                    date_end: dateRange[5] + " 23:59:59",
                });
                const res = response.data;

                weekSales.fiveDayAgo = res[0].daySales;
                console.log(res, "이거이거")

                // 차트를 다시 그리는 함수 호출
                drawSalesChart();// 매출 차트
            } catch (error) {
                alert(error);
            }
        };

        // 성별 회원 차트를 그리는 함수 정의
        const drawUserChart = () => {
            // 이전 차트 인스턴스 제거
            if (myChart.value && myChart.value.chart) {
                myChart.value.chart.destroy();
            }


            if (myChart.value) {
                const ctx = myChart.value.getContext('2d');
                myChart.value.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['남성', '여성'],
                        datasets: [
                            {
                                data: [userSex.female, userSex.male],
                                backgroundColor: ['#4e73df', '#e74a3b'],
                            },
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        aspectRatio: 2,
                        cutout: 100,
                        radius: '100%',
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        size: 12,
                                        weight: 'bold',
                                    },
                                    color: '#858796',
                                    pointStyle: 'circle',
                                    usePointStyle: true,
                                },
                            },
                        },
                    },
                });
            }
        };

        // 나이대 차트를 그리는 함수 정의
        const drawUserArangeChart = () => {
            // 이전 차트 인스턴스 제거
            if (myChart2.value && myChart2.value.chart) {
                myChart2.value.chart.destroy();
            }


            if (myChart2.value) {
                const ctx = myChart2.value.getContext('2d');
                myChart2.value.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['남성', '여성'],
                        datasets: [
                            {
                                data: ["3", "3"],
                                backgroundColor: ['#4e73df', '#e74a3b'],
                            },
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        aspectRatio: 2,
                        cutout: 100,
                        radius: '100%',
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        size: 12,
                                        weight: 'bold',
                                    },
                                    color: '#858796',
                                    pointStyle: 'circle',
                                    usePointStyle: true,
                                },
                            },
                        },
                    },
                });
            }
        };

        const drawSalesChart = () => {
            // 이전 차트 인스턴스 제거
            if (dailySalesChart.value && dailySalesChart.value.chart) {
                dailySalesChart.value.chart.destroy();
            }

            if (dailySalesChart) {
                const ctx = dailySalesChart.value.getContext('2d');
                dailySalesChart.value.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [
                            dateRange[5],
                            dateRange[4],
                            dateRange[3],
                            dateRange[2],
                            dateRange[1],
                            dateRange[0],
                        ],
                        datasets: [
                            {
                                label: '금액', // Add dataset label
                                data: [weekSales.fiveDayAgo, weekSales.fourDayAgo, weekSales.threeDayAgo, weekSales.twoDayAgo, weekSales.yesday, weekSales.today],
                                backgroundColor: 'rgba(231, 74, 59, 0.1)', // 반투명 배경색 설정
                                borderColor: '#e74a3b', // 선 색상 설정
                                borderWidth: 2, // 선 두께 설정
                                hoverOffset: 1,
                                tension: 0.3, // 곡선의 강도 설정 (0에서 1 사이의 값)
                                fill: true,
                            },
                        ],
                    },
                    options: {
                        responsive: false,
                        plugins: {
                            tooltip: {
                                padding: 10,
                            },
                        },
                    },
                });
            }
        };

        onMounted(() => {
            updateUserSex();
            updateSales();




        });

        return {
            myChart,
            dailySalesChart,
            userSex, // 이렇게 userSex를 반환 객체에 추가
        };
    },
    mounted() {
        this.getUserData();
    },
    methods: {
        async getUserData() {
            await axios({
                url: "http://localhost:3000/admin/adminUserLatest",
                method: "POST",
                data: {
                },
            })
                .then((res) => {
                    //회원수를 저장
                    this.userCount = res.data.length;

                    //나이대 저장

                    this.ageArangeData[0].teenagers = res.data.filter(item => item.USER_AGEGROUP === "10").length;
                    this.ageArangeData[1].twenties = res.data.filter(item => item.USER_AGEGROUP === "20").length;
                    this.ageArangeData[2].thirties = res.data.filter(item => item.USER_AGEGROUP === "30").length;
                    this.ageArangeData[3].forties = res.data.filter(item => item.USER_AGEGROUP === "40").length;
                    this.ageArangeData[4].fifties = res.data.filter(item => item.USER_AGEGROUP === "50").length;
                    this.ageArangeData[5].sixties = res.data.filter(item => item.USER_AGEGROUP === "60").length;
                    console.log(this.ageArangeData, "나이대")

                    //성별에 따른 회원수 저장
                    const femaleMembers = res.data.filter(item => item.USER_SEX === 'f');
                    const maleMembers = res.data.filter(item => item.USER_SEX === 'm');

                    this.userSex.female = femaleMembers.length;
                    this.userSex.male = maleMembers.length;
                    console.log(this.userSex, "회원데이터")
                })
                .catch((err) => {
                    alert(err);
                });
        },
        formatNumber(number) {
            // 숫자를 천 단위마다 쉼표가 있는 형식으로 변환
            return new Intl.NumberFormat().format(number);
        },
    }
};
</script>