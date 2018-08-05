$(() => {
  const options = {
    chart: {
      type: 'line',
      height: 500,
      animations: {
        enabled: false,
      },
    },
    title: {
      text: '',
    },
    series: [{
      name: '現在値',
      data: [],
    }, {
      name: '高値',
      data: [],
    }, {
      name: '安値',
      data: [],
    }],
    xaxis: {
      categories: [],
    },
    yaxis: {
      max: 0,
      min: 0,
    },
  };

  let chart;

  const getChartData = () => {
    $.getJSON('/api/chartdata').then((chartData) => {
      options.series[0].data.length = 0;
      options.series[1].data.length = 0;
      options.series[2].data.length = 0;
      options.xaxis.categories.length = 0;
      options.title.text = `BTC/JPY - ${chartData[0].closeBid}`;

      chartData.forEach((data) => {
        options.series[0].data.unshift(data.closeBid);
        options.series[1].data.unshift(data.highBid);
        options.series[2].data.unshift(data.lowBid);
        options.xaxis.categories.unshift(data.time.replace('2018-', ''));
      });

      options.yaxis.max = Math.ceil(Math.max(...options.series[1].data) / 1000) * 1000 + 2000;
      options.yaxis.min = Math.floor(Math.min(...options.series[2].data) / 1000) * 1000 - 2000;

      if (chart) chart.destroy();
      chart = new ApexCharts(document.querySelector('#chart'), options);
      chart.render();
    });
  };

  setInterval(getChartData, 60 * 1000);
  getChartData();

  $('#submitEmail').click(() => {
    $.ajax({
      type: 'POST',
      url: '/api/email',
      data: {
        email: $('#exampleInputEmail1').val(),
      },
    }).then((result) => {
      alert(`${result.email}にメールを送信しました`);
    });

    $('#exampleInputEmail1').val(null);
  });

  const urlParser = new URL(location.href);
  if (urlParser.searchParams.has('deleted')) {
    const email = urlParser.searchParams.get('deleted');

    $('#deleteModalBody').text(`${email}のメール購読を解除しますか？`);
    $('#deleteModal').modal('show').on('hidden.bs.modal', () => {
      location.href = '/';
    });

    $('#deleteEmail').click(() => {
      $.ajax({
        type: 'DELETE',
        url: '/api/email',
        data: { email },
      }).then((result) => {
        alert(`${result.email}のメール購読を解除しました`);
        location.href = '/';
      });
  
      $('#exampleInputEmail1').val(null);
    });
  }
});
