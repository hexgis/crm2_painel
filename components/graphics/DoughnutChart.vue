<script>
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  mounted() {
    this.renderChart(
      {
        labels: [
          "January",
          "February",
          "March",
        ],
        datasets: [
          {
            label: "Polígono: Prioridade Alta",
            backgroundColor: "#f87979",
            data: [40, 20, 30]
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>