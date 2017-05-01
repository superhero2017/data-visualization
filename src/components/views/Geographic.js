import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Geo from '../charts/Geo'
import Bipartite from '../charts/Bipartite'
import PageFooter from '../layout/PageFooter'

export default {
  name: 'geographic',
  template: require('components/views/Geographic.html'),
  props: ['view'],
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    Geo,
    Bipartite,
    PageFooter
  },
  data () {
    return {
      model: nch.model
    }
  },
  mounted() {
    console.log( "Geographic view: " + this.view );
  }
}