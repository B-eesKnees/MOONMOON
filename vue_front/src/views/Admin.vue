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
                            <h1 class="h3 mb-0 text-gray-800">대쉬보드</h1>
                        </div>

                        <!-- Content Row -->
                        <div class="row">

                            <!-- Earnings (Monthly) Card Example -->
                            <div class="col-xl-3 col-md-6 mb-4">
                                <div class="card border-left-primary shadow h-100 py-2">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                    오늘 매출</div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">₩ 40,000</div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-won-sign fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Earnings (Monthly) Card Example -->
                            <div class="col-xl-3 col-md-6 mb-4">
                                <div class="card border-left-success shadow h-100 py-2">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                    전일 대비 매출</div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">₩ 215,000 <i class="fa-solid fa-up-long"></i></div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-won-sign fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Earnings (Monthly) Card Example -->
                            <div class="col-xl-3 col-md-6 mb-4">
                                <div class="card border-left-info shadow h-100 py-2">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">오늘 방문자 수
                                                </div>
                                                <div class="row no-gutters align-items-center">
                                                    <div class="col-auto">
                                                        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">300</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="progress progress-sm mr-2">
                                                            <div class="progress-bar bg-info" role="progressbar"
                                                                style="width: 50%" aria-valuenow="50" aria-valuemin="0"
                                                                aria-valuemax="100"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Pending Requests Card Example -->
                            <div class="col-xl-3 col-md-6 mb-4">
                                <div class="card border-left-warning shadow h-100 py-2">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                    회원 수</div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">5283</div>
                                            </div>
                                            <div class="col-auto">
                                                <i class="fa-solid fa-eye fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Content Row -->

                        <div class="row">

                            <!-- Area Chart -->
                            <div class="col-xl-8 col-lg-7">
                                <div class="card shadow mb-4">
                                    <!-- Card Header - Dropdown -->
                                    <div
                                        class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-primary">주간 매출</h6>

                                    </div>
                                    <!-- Card Body -->
                                    <div class="card-body">
                                        <div class="chart-area d-flex align-items-center justify-content-center">
                                            <canvas ref="dailySalesChart" width="1000" height="300"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Pie Chart -->
                            <div class="col-xl-4 col-lg-5">
                                <div class="card shadow mb-4">
                                    <!-- Card Header - Dropdown -->
                                    <div
                                        class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-primary">회원 분포</h6>
                                    </div>
                                    <!-- Card Body -->
                                    <div class="card-body">
                                        <div class="chart-area">
                                            <canvas ref="myChart"></canvas>
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
                                    <div class="card-body">
                                        <a class="small font-weight-bold ">세이노의 가르침 - <span
                                                class="badge bg-danger">미완료</span></a>

                                    </div>
                                </div>

                                <!-- Approach -->
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">미완료 문의</h6>
                                    </div>
                                    <div class="card-body">
                                        <a class="small font-weight-bold ">환불관련 문의 드립니다. - <span
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

        <!-- Logout Modal-->
        <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                        <a class="btn btn-primary" href="login.html">Logout</a>
                    </div>
                </div>
            </div>
        </div>

    </body>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import 'bootstrap'; // Import Bootstrap JavaScript
import 'chartjs-adapter-luxon';
import SideBar from '../components/adminSidebar.vue';

export default {
    components: { SideBar },
    setup() {
        const myChart = ref(null);
        const dailySalesChart = ref(null);

        onMounted(() => {
            if (myChart.value) {
                const ctx = myChart.value.getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['남성', '여성'],
                        datasets: [
                            {
                                data: [10, 20],
                                backgroundColor: ['#4e73df', '#e74a3b']
                            }
                        ]
                    },
                    options: {
                        maintainAspectRatio: false,
                        aspectRatio: 2,
                        cutout: 100, // 굵기를 조절하는 옵션
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

            if (dailySalesChart) {
                const ctx = dailySalesChart.value.getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [
                            '2023-08-18',
                            '2023-08-19',
                            '2023-08-20',
                            '2023-08-21',
                            '2023-08-22',
                            '2023-08-23'
                        ],
                        datasets: [
                            {
                                label: '금액', // Add dataset label
                                data: [725000, 210000, 5723000, 6234000, 4230000, 1210000],
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
        });

        return {
            myChart,
            dailySalesChart,
        };
    },
};
</script>