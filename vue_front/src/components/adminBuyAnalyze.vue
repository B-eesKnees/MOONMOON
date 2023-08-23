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
                            <h1 class="h3 mb-0 text-gray-800">구매 분석</h1>
                        </div>


                        <!-- Content Row -->
                        <div class="row d-flex align-items-center justify-content-center">
                            <div v-for="i in 5" :key="i" class="mb-4" style="width: 10%;">
                                <div class="card shadow h-100 mb-5" :class="{
                                    'cardshadow h-100 mb-5 border-bottom-danger': i === 1,
                                    'cardshadow h-100 mb-5 border-bottom-secondary': i === 2,
                                    'cardshadow h-100 mb-5 border-bottom-warning': i === 3,
                                    'cardshadow h-100 mb-5 border-bottom-primary': i === 4,
                                    'cardshadow h-100 mb-5 border-bottom-info': i === 5,
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
                                                        
                                                    }">
                                                    {{ i }}위
                                                </div>
                                                <div class="row no-gutters align-items-center">
                                                    <div class="col-auto">
                                                        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                            소설</div>
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

                        <div class="row d-flex align-items-center justify-content-center">
                            <!-- Area Chart -->
                            <div class="col-xl-8 col-lg-7">
                                <div class="card shadow mb-4">
                                    <!-- Card Header - Dropdown -->
                                    <div
                                        class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-primary">많이 구매한 책의 장르</h6>

                                    </div>
                                    <!-- Card Body -->
                                    <div class="card-body">
                                        <div class="chart-area d-flex align-items-center justify-content-center">
                                            <canvas ref="dailyVisitChart" width="1000" height="300"></canvas>
                                        </div>
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

            //주간 방문자 수
            weekVisit: 0,
        }
    },
    setup() {
        const dailyVisitChart = ref(null);

        //방문자 수 데이터
        var weekVisit = reactive([
            {
                date: "2023-01-01",
                count: 0,
            },
            {
                date: "2023-01-01",
                count: 0,
            },
            {
                date: "2023-01-01",
                count: 0,
            },
            {
                date: "2023-01-01",
                count: 0,
            },
            {
                date: "2023-01-01",
                count: 0,
            },
            {
                date: "2023-01-01",
                count: 0,
            },
            {
                date: "2023-01-01",
                count: 0,
            },
        ]);

        //----------------------------------여기부터 서버에서 데이터 불러오는 함수-------------------------------------
       
        // 주간 방문자 수 데이터를 업데이트하는 함수 정의
        const updateWeekVisit = async () => {
            try {
                const response = await axios.post('http://localhost:3000/admin/getTotalV', {});
                const data = response.data.slice(0, 7);

                // 데이터를 주간 방문자 수 배열에 할당
                weekVisit = data.map(item => {
                    return {
                        date: item.vc_date,
                        count: item.vc_count
                    };
                });

                console.log(weekVisit, "주간 방문자 수 데이터");

                // 차트를 다시 그리는 함수 호출
                drawWeekVisitChart();
            } catch (error) {
                alert(error);
            }
        };

        //----------------------------------여기부터 차트 함수-------------------------------------

        const drawWeekVisitChart = () => {
            // 일별 방문자데이터들의 최대값 가져오기
            const maxCount = Math.max(...weekVisit.map(item => item.count));

            // 이전 차트 인스턴스 제거
            if (dailyVisitChart.value && dailyVisitChart.value.chart) {
                dailyVisitChart.value.chart.destroy();
            }

            if (dailyVisitChart) {
                const ctx = dailyVisitChart.value.getContext('2d');
                dailyVisitChart.value.chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: [
                            weekVisit[6].date,
                            weekVisit[5].date,
                            weekVisit[4].date,
                            weekVisit[3].date,
                            weekVisit[2].date,
                            weekVisit[1].date,
                            weekVisit[0].date,
                        ],
                        datasets: [
                            {
                                label: '방문자 수', // Add dataset label
                                data: [weekVisit[0].count, weekVisit[1].count, weekVisit[2].count, weekVisit[3].count, weekVisit[4].count, weekVisit[5].count, weekVisit[6].count],
                                backgroundColor: '#F6C23E', // 반투명 배경색 설정
                                borderColor: '#F6C23E', // 선 색상 설정
                                hoverOffset: 1,
                                fill: true,
                            },
                        ],
                    },
                    options: {
                        responsive: false,
                        scales: {
                            x: {
                                grid: {
                                    display: false, // 배경 세로 선 숨기기
                                },
                            },
                            y: {
                                beginAtZero: true, // y 축의 값이 0부터 시작하도록 설정

                            },
                        },
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
            updateWeekVisit();




        });

        return {
            dailyVisitChart,
        };
    },
    mounted() {
        this.updateWeekVisit();
    },
    methods: {
   
        // 주간 방문자수 데이터 받기
        async updateWeekVisit() {
            await axios({
                url: "http://localhost:3000/admin/getTotalV",
                method: "POST",
                data: {
                },
            })
                .then((res) => {
                    const data = res.data.slice(0, 7);

                    //이전 1주일간 매일 방문자수를 저장
                    data.map(item => this.weekVisit += item.vc_count);
                    console.log(this.weekVisit, "주간방문자수 데이터")
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