Promise.all([
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/allSongsAvgs_decade.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/allSongsAvgs_yearIn2010s.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/allSongs2010s_allMostLeastPopAvgs.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/artistsWithMostPopSongs2010s.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/pop2010_numartists.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/pop2010_explicit.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/pop2010_mode.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/pop2010_key.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/explicit_decade.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/num_artists_decade.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/topartists_explicit.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/kelsey-n/spotify-data-challenge/main/data/topartists_avgvals.csv", d3.autoType)
]).then(function(data) {

  var all_decade = data[0]
                    .filter(row => row.release_decade != '2020s');
  var all_2010 = data[1];
  var pop_nonpop_2010 = data[2];
  var popartists = data[3]
                    .filter(row => row.totalsongs > 12); //only take top 10 artists
  var numartists = data[4];
  var explicit = data[5];
  var mode = data[6];
  var key = data[7];
  var explicit_decade = data[8];
  var numartists_decade = data[9];
  var topartists_explicit = data[10]
                              .filter(row => row.total_songs > 12);
  var topartists_avgvals = data[11]
                              .filter(row => row.id > 12);

  allvars_timeline_decade('chart1', all_decade)

  explicit_decade_timeline('chart2', explicit_decade)

  numartists_decade_timeline('chart3', numartists_decade)

  // timeline_subplot('chart4', pop_nonpop_2010)
  //
  // // here create timeline of pattern by year in 2010
  //
  //
  // timeline2('chart2', pop_nonpop_2010)
  //
  // pieChart('chart3', numartists, 'num_artists')
  //
  // pieChart('chart4', explicit, explicit)
  //
  // pieChart('chart5', mode, mode)
  //
  // barChart('chart6', key)
  //
  //stackBarChart('chart5', popartists)
  stackBarChartTEST('chart5', popartists, topartists_avgvals)

});

// create variable containing quantitative variables that we want to plot, ranging from 0 to 1:
var quant = [
  'acousticness', 'danceability', 'energy', 'instrumentalness',
  // 'liveness','speechiness', 'explicit', 'collaboration'
  'valence', //'loudness'
];
var colors = {
  'acousticness': '#ff7c43',
  'danceability': '#00AF91',
  'energy': '#F25287',
  'instrumentalness': '#a05195', // CHANGE COLOR
  'liveness': '#a05195',
  'speechiness': '#28DF99',
  'valence': '#ffa600',
  'explicit': '#FF7A00',
  'collaboration': '#39A2DB',
};

// get window size to set distances svg width for radial chart & distance from edge of grid-items
var windowWidth = window.innerWidth
var windowHeight = window.innerHeight

document.getElementById('radial-chart').setAttribute("width", ((windowWidth - 300) / 2));
document.getElementById('radial-chart').setAttribute("height", ((windowHeight - 120) / 3 * 2));
// document.getElementById('chart4').setAttribute("width", (windowWidth - 300) / 2);
// document.getElementById('chart4').setAttribute("height", (windowHeight - 120) / 3);

// create a function to turn an array into numbers for varying opacity
function opacityBreaks(data) {
  var opacityVals = [];
  var opacityOptions = [0.4, 0.6, 0.8, 1]
  for (let val of data) {
    var opacVal = 0
    if (val < 0.3) {
      opacVal = opacityOptions[0]
    }
    else if ((val >= 0.3) && (val < 0.5)) {
      opacVal = opacityOptions[1]
    }
    else if ((val >= 0.5) && (val < 0.7)) {
      opacVal = opacityOptions[2]
    }
    else if (val >= 0.7) {
      opacVal = opacityOptions[3]
    }
    opacityVals.push(opacVal)
  }
  return opacityVals
}

function allvars_timeline_decade(chartid, dataset) {
  var data = [];
  var lineSize = [3,1,3,1,1,1,1];

  for (let i = 0; i < quant.length; i++) {
    data.push({
      type: "scatter",
      mode: "lines",
      name: `${quant[i]}`,
      x: dataset.map(row => row.release_decade),
      y: dataset.map(row => row[`${quant[i]}`]),
      line: {
        dash: 'solid',
        color: colors[quant[i]],
        width: lineSize[i]
      }
    });
  }

  var layout = {
    margin: {
      t: 0, //top margin
      l: 30, //left margin
      r: 30, //right margin
      b: 0 //bottom margin
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    yaxis: {
      tickfont: {
        size: 9,
        color: '#ffffffdd'
      },
      showgrid: false,
      showline: true,
      mirror: true
    },
    xaxis: {
      side: 'top',
      // visible: false,
      tickfont: {
        size: 9.5,
        color: '#ffffffdd'
      },
      showgrid: false,
    },
  annotations: [
    {
      x: 4.7,
      y: 0.8,
      xref: 'x',
      yref: 'y',
      text: `Notable &#8593; in<br>& &#8595; in`,
      font: {
        family: 'sans-serif',
        size: 11,
        color: '#ffffffdd'
      },
      showarrow: false,
      ax: 0,
      ay: 0
    },
      {
        x: 6.4,
        y: 0.83,
        xref: 'x',
        yref: 'y',
        text: `<b>energy</b>`,
        font: {
          family: 'sans-serif',
          size: 11,
          color: colors.energy
        },
        showarrow: false,
        ax: 0,
        ay: 0
      },
        {
          x: 6.5,
          y: 0.775,
          xref: 'x',
          yref: 'y',
          text: `<b>acousticness</b>`,
          font: {
            family: 'sans-serif',
            size: 11,
            color: colors.acousticness
          },
          showarrow: false,
          ax: 0,
          ay: 0
        },
  ]
  };

  var config = {
    'displayModeBar': false // this is the line that hides the bar.
  };

  Plotly.newPlot(chartid, data, layout, config);
}

function explicit_decade_timeline(chartid, dataset) {

  trace1 = {
    type: "scatter",
    mode: "lines",
    x: dataset.map(row => row.release_decade),
    y: dataset.map(row => row.perc_explicit),
    line: {
      dash: 'solid',
      color: colors.explicit
    }
  };

  var layout = {
    margin: {
      t: 0, //top margin
      l: 30, //left margin
      r: 30, //right margin
      b: 0 //bottom margin
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    yaxis: {
      tickfont: {
        size: 9,
        color: '#ffffffdd'
      },
      ticksuffix: '%',
      showgrid: false,
      showline: true,
      mirror: true,
      zeroline: false,
    },
    xaxis: {
      tickfont: {
        size: 9
      },
      ticklabelposition: 'outside right',
      showgrid: false,
    },
  annotations: [
    {
      xref: 'paper',
      yref: 'paper',
      x: 0.5,
      xanchor: 'right',
      y: 0.85,
      yanchor: 'bottom',
      text: '<b>Explicit Songs</b>',
      font: {
        size: 14,
        color: colors.explicit
      },
      showarrow: false
    },
    {
      x: 4,
      y: 0.5,
      xref: 'x',
      yref: 'y',
      text: 'Explicit songs made<br>up only 0.2% of all<br>songs in the 1970s...',
      showarrow: true,
      arrowcolor: '#ffffffdd',
      font: {
        family: 'sans-serif',
        size: 11,
        color: '#ffffffdd'
      },
      ax: -40,
      ay: -40
    },
      {
        x: 7.7,
        y: 11.7,
        xref: 'x',
        yref: 'y',
        text: '...but jumped to<br>12% in the 2010s',
        showarrow: true,
        arrowcolor: '#ffffffdd',
        font: {
          family: 'sans-serif',
          size: 11,
          color: '#ffffffdd'
        },
        ax: -70,
        ay: 30
      },
  ]
  };

  var config = {
    'displayModeBar': false // this is the line that hides the bar.
  };

  var data = [trace1]

  Plotly.newPlot(chartid, data, layout, config);
}

function numartists_decade_timeline(chartid, dataset) {

  trace1 = {
    type: "scatter",
    mode: "lines",
    x: dataset.map(row => row.release_decade),
    y: dataset.map(row => row.perc_collab),
    line: {
      dash: 'solid',
      color: colors.collaboration
    }
  };

  var layout = {
    margin: {
      t: 0, //top margin
      l: 30, //left margin
      r: 30, //right margin
      b: 30 //bottom margin
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    yaxis: {
      tickfont: {
        size: 9,
        color: '#ffffffdd'
      },
      ticksuffix: '%',
      showgrid: false,
      showline: true,
      mirror: true
    },
    xaxis: {
      tickfont: {
        size: 9.5,
        color: '#ffffffdd'
      },
      showgrid: false,
    },
    annotations: [
      {
        xref: 'paper',
        yref: 'paper',
        x: 1,
        xanchor: 'right',
        y: 0.85,
        yanchor: 'bottom',
        text: '<b>Collaborations</b>',
        font: {
          size: 14,
          color: colors.collaboration
        },
        showarrow: false
      },
      {
        x: 5,
        y: 25,
        xref: 'x',
        yref: 'y',
        text: "Biggest collab was 58<br>artists for Bollywood's<br><em>Monsta Mashup 2019</em>",
        showarrow: false,
        font: {
          family: 'sans-serif',
          size: 11,
          color: '#ffffffdd'
        },
        ax: -40,
        ay: -40
      },
    ]
  };

  var config = {
    'displayModeBar': false // this is the line that hides the bar.
  };

  var data = [trace1]

  Plotly.newPlot(chartid, data, layout, config);
}

function timeline2(chartid, dataset) {
  var data = [];

  for (let i = 0; i < quant.length; i++) {
    data.push({
      type: "scatter",
      mode: "lines",
      name: `${quant[i]} (Most popular)`,
      x: dataset.map(row => row.release_year),
      y: dataset.map(row => row[`${quant[i]}_pop`] - row[`${quant[i]}_all`]),
      line: {
        dash: 'solid',
        color: colors[i]
      }
    });

    data.push({
      type: "scatter",
      mode: "lines",
      name: `${quant[i]} (Least popular)`,
      x: dataset.map(row => row.release_year),
      y: dataset.map(row => row[`${quant[i]}_leastpop`] - row[`${quant[i]}_all`]),
      line: {
        dash: 'dot',
        color: colors[i]
      }
    });
  }

  Plotly.newPlot(chartid, data);
}

function timeline_subplot(chartid, pop_nonpop_2010) {
  var dance1 = {
    x: pop_nonpop_2010.map(row => row.release_year),
    y: pop_nonpop_2010.map(row => row.danceability_all),
    legendgroup: 'All',
    xaxis: 'x',
    yaxis: 'y',
    type: 'scatter',
    mode: 'lines',
    line: {
      dash: 'solid',
      color: colors[1],
      width: 3
    }
  }

  var dance2 = {
    x: pop_nonpop_2010.map(row => row.release_year),
    y: pop_nonpop_2010.map(row => row.danceability_pop),
    legendgroup: 'Most Pop',
    xaxis: 'x',
    yaxis: 'y',
    type: 'scatter',
    mode: 'lines',
    line: {
      dash: 'dash',
      color: colors[1]
    }
  }

  var dance3 = {
    x: pop_nonpop_2010.map(row => row.release_year),
    y: pop_nonpop_2010.map(row => row.danceability_leastpop),
    legendgroup: 'Least Pop',
    xaxis: 'x',
    yaxis: 'y',
    type: 'scatter',
    mode: 'lines',
    line: {
      dash: 'dot',
      color: colors[1]
    }
  }

  var ins1 = {
    x: pop_nonpop_2010.map(row => row.release_year),
    y: pop_nonpop_2010.map(row => row.instrumentalness_all),
    legendgroup: 'All',
    xaxis: 'x2',
    yaxis: 'y2',
    type: 'scatter',
    mode: 'lines',
    line: {
      dash: 'solid',
      color: colors[3],
      width: 3
    }
  }

  var ins2 = {
    x: pop_nonpop_2010.map(row => row.release_year),
    y: pop_nonpop_2010.map(row => row.instrumentalness_pop),
    legendgroup: 'Most Pop',
    xaxis: 'x2',
    yaxis: 'y2',
    type: 'scatter',
    mode: 'lines',
    line: {
      dash: 'dash',
      color: colors[3]
    }
  }

  var ins3 = {
    x: pop_nonpop_2010.map(row => row.release_year),
    y: pop_nonpop_2010.map(row => row.instrumentalness_leastpop),
    legendgroup: 'Least Pop',
    xaxis: 'x2',
    yaxis: 'y2',
    type: 'scatter',
    mode: 'lines',
    line: {
      dash: 'dot',
      color: colors[3]
    }
  }

  var loud1 = {
    x: pop_nonpop_2010.map(row => row.release_year),
    y: pop_nonpop_2010.map(row => row.loudness_all),
    legendgroup: 'All',
    xaxis: 'x3',
    yaxis: 'y3',
    type: 'scatter',
    mode: 'lines',
    line: {
      dash: 'solid',
      color: colors[7],
      width: 3
    }
  }

  var loud2 = {
    x: pop_nonpop_2010.map(row => row.release_year),
    y: pop_nonpop_2010.map(row => row.loudness_pop),
    legendgroup: 'Most Pop',
    xaxis: 'x3',
    yaxis: 'y3',
    type: 'scatter',
    mode: 'lines',
    line: {
      dash: 'dash',
      color: colors[7]
    }
  }

  var loud3 = {
    x: pop_nonpop_2010.map(row => row.release_year),
    y: pop_nonpop_2010.map(row => row.loudness_leastpop),
    xaxis: 'x3',
    yaxis: 'y3',
    legendgroup: 'Least Pop',
    type: 'scatter',
    mode: 'lines',
    line: {
      dash: 'dot',
      color: colors[7]
    }
  }


  var data = [dance1,dance2,dance3,ins1,ins2,ins3,loud1,loud2,loud3];

  var layout = {
    grid: {rows: 1, columns: 3, pattern: 'independent'},
    margin: {
      t: 0, //top margin
      l: 18, //left margin
      r: 0, //right margin
      b: 0 //bottom margin
    },
    // title: {
    //   text: `Most popular songs (&#8212; &#8212;) compared to all (<b>&#8212;</b>) & Least Popular (---) songs`,
    //   font: {
    //     size: 12,
    //   },
    // },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    legend: {
      orientation: 'h',
    },
    yaxis: {
      tickfont: {
        size: 9
      },
      showgrid: false,
      showline: true,
      mirror: true
    },
    xaxis: {
      // visible: false,
      tickfont: {
        size: 9
      }
    },
    yaxis: {
      tickfont: {
        size: 9
      },
      showgrid: false,
      showline: true,
    },
    xaxis2: {
      // visible: false,
      tickfont: {
        size: 9
      }
    },
    yaxis2: {
      tickfont: {
        size: 9
      },
      showgrid: false,
      showline: true,
    },
    xaxis3: {
      // visible: false,
      tickfont: {
        size: 9
      },
    },
    yaxis3: {
      tickfont: {
        size: 9
      },
      showgrid: false,
      showline: true,
    },
    annotations: [
      {
        xref: 'paper',
        yref: 'paper',
        x: 0.07,
        xanchor: 'right',
        y: 0.8,
        yanchor: 'bottom',
        text: 'high',
        font: {
          size: 11,
          color: 'black',
          family: 'monospace'
        },
        showarrow: false
      },
        {
          xref: 'paper',
          yref: 'paper',
          x: 0.17,
          xanchor: 'right',
          y: 0.72,
          yanchor: 'bottom',
          text: '<b> danceability </b>',
          font: {
            size: 11,
            color: colors[1],
            family: 'monospace'
          },
          showarrow: false
        },
    ]

  };

  var config = {
    'displayModeBar': false // this is the line that hides the bar.
  };

  Plotly.newPlot(chartid, data, layout, config);
}

// TESTING STACK BAR CHART!!!!!!!!

function stackBarChartTEST(chartid, dataset1, dataset3) {

  var trace1 = {
    type: "bar",
    legendgroup: 'Solo/Collab',
    name: `Solos`,
    y: dataset1.map(row => row.artist),
    x: dataset1.map(row => row.num_solos),
    orientation: 'h',
    marker: {
      color: '#39A2DB'
    }
  };

  var trace2 = {
    type: "bar",
    legendgroup: 'Solo/Collab',
    name: `Collabs`,
    y: dataset1.map(row => row.artist),
    x: dataset1.map(row => row.num_collabs),
    orientation: 'h',
    marker: {
      color: '#39A2DB90'
    }
  };

  var annotations = [
    {
      x: 1,
      xanchor: 'right',
      y: 1,
      yanchor: 'bottom',
      xref: 'paper',
      yref: 'paper',
      text: 'Top Artists',
      showarrow: false,
      font: {
        family: 'sans-serif',
        size: 30,
        color: '#ffffffcc'
      },
      align: 'center',
    },
    {
      x: -0.25,
      xanchor: 'right',
      y: 1,
      yanchor: 'bottom',
      xref: 'paper',
      yref: 'paper',
      text: '<em>Avg Values (Artist Top Songs)</em>',
      showarrow: false,
      font: {
        family: 'sans-serif',
        size: 13,
        color: '#ffffffcc',
      },
      align: 'center',
    }
  ];
  var artists = dataset3.map(row => row.artists_list)
  // danceability, energy, acousticness, valence
  var danceability = dataset3.map(row => row.danceability)
  var dance_opac = opacityBreaks(danceability)
  var energy = dataset3.map(row => row.energy)
  var energy_opac = opacityBreaks(energy)
  var acousticness = dataset3.map(row => row.acousticness)
  var acousticness_opac = opacityBreaks(acousticness)
  var valence = dataset3.map(row => row.valence)
  var valence_opac = opacityBreaks(valence)

  for (let i = 0; i < 10; i++) {
    annotations.push({
      x: -0.4,
      y: artists[i],
      xref: 'paper',
      yref: 'y',
      text: danceability[i],
      showarrow: false,
      font: {
        size: 14,
        color: '#ffffffdd'
      },
      align: 'center',
      bgcolor: colors.danceability,
      opacity: dance_opac[i],
      'border-radius': 50
    },
    {
      x: -0.55,
      y: artists[i],
      xref: 'paper',
      yref: 'y',
      text: energy[i],
      showarrow: false,
      font: {
        size: 14,
        color: '#ffffffdd'
      },
      align: 'center',
      bgcolor: colors.energy,
      opacity: energy_opac[i],
    },
    {
      x: -0.7,
      y: artists[i],
      xref: 'paper',
      yref: 'y',
      text: acousticness[i],
      showarrow: false,
      font: {
        size: 14,
        color: '#ffffffdd'
      },
      align: 'center',
      bgcolor: colors.acousticness,
      opacity: acousticness_opac[i]
    },
    {
      x: -0.85,
      y: artists[i],
      xref: 'paper',
      yref: 'y',
      text: valence[i],
      showarrow: false,
      font: {
        size: 14,
        color: 'black'
      },
      align: 'center',
      bgcolor: colors.valence,
      opacity: valence_opac[i]
    },
  {
    x: 0,
    y: artists[i],
    xref: 'paper',
    yref: 'y',
    text: artists[i],
    showarrow: false,
    align: 'center',
    xanchor: 'left',
    font: {
      color: '#121212'
    },
  });
  }

  var images = [];
  var image_urls = {
    'Bruno Mars': "https://live.staticflickr.com/65535/51343715028_d36c7e7b21_t.jpg", //Bruno
    'Drake': "https://live.staticflickr.com/65535/51343715038_c5f2be10cb_t.jpg", //Drake
    'Rihanna': "https://live.staticflickr.com/65535/51344508360_a2815529e4_t.jpg", //Rihanna
    'One Direction': "https://live.staticflickr.com/65535/51344360289_bae2f8632d_t.jpg", //1D
    'Ed Sheeran': "https://live.staticflickr.com/65535/51343839723_cc423a24a8_t.jpg", //Ed Sheeran
    'Calvin Harris': "https://live.staticflickr.com/65535/51343611821_cbf648c0c2_t.jpg", //Calvin Harris
    'Justin Bieber': "https://live.staticflickr.com/65535/51343839733_d337f98dfb_t.jpg", //Justin Bieber
    'Ariana Grande': "https://live.staticflickr.com/65535/51342898012_fd169e647e_t.jpg", //Ariana Grande
    'Post Malone': "https://live.staticflickr.com/65535/51342898027_1b88905bda_t.jpg", //Post Malone
    'The Weeknd': "https://live.staticflickr.com/65535/51344360359_0a75aafb85_t.jpg" //The Weeknd
  };

  for (let i = 0; i < 10; i++) {
    images.push({
      source: image_urls[artists[i]],
      xref: "paper",
      yref: 'y',
      x: -0.23,
      y: artists[i],
      sizex: 1,
      sizey: 1,
      align: 'center',
      yanchor: 'middle'
    })
  }

  var layout = {
    barmode: "stack",
    margin: {
      t: 40, //top margin
      l: 300, //left margin
      r: 0, //right margin
      b: 20 //bottom margin
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: true,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 0,
      font: {
        color: '#ffffffdd'
      }
    },
    yaxis: {
      showticklabels: false,
      showgrid: false,
      autorange: 'reversed',
    },
    xaxis: {
      tickfont: {
        size: 9,
        color: '#ffffffdd'
      },
      showgrid: true,
    },
    annotations: annotations,
    images: images,
  }

  var config =  {
      'displayModeBar': false // this is the line that hides the bar.
    };

  var data = [trace1, trace2]

  Plotly.newPlot(chartid, data, layout, config);
}









function stackBarChart(chartid, dataset) {
  // var soloPop = dataset.map(row => row.solo_avgpop)
  // var soloOpac = opacityBreaks(soloPop)
  // var collabPop = dataset.map(row => row.collab_avgpop)
  // var collabOpac = opacityBreaks(collabPop)

  trace1 = {
    type: "bar",
    name: `Solos`,
    y: dataset.map(row => row.artist),
    x: dataset.map(row => row.num_solos),
    orientation: 'h',
    marker: {
      // opacity: soloOpac
    }
  };

  trace2 = {
    type: "bar",
    name: `Collabs`,
    y: dataset.map(row => row.artist),
    x: dataset.map(row => row.num_collabs),
    orientation: 'h',
    marker: {
      // opacity: collabOpac
    }
  };

  layout = {
    barmode: "stack",
    margin: {
      t: 0, //top margin
      l: 200, //left margin
      r: 0, //right margin
      b: 20 //bottom margin
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    yaxis: {
      tickfont: {
        size: 9
      },
      showgrid: false,
      autorange: 'reversed',
    },
    xaxis: {
      tickfont: {
        size: 9
      },
      showgrid: false,
    },
  }

  var config =  {
      'displayModeBar': false // this is the line that hides the bar.
    };

  var data = [trace1, trace2]

  Plotly.newPlot(chartid, data, layout, config);
}

function pieChart(chartid, dataset, property) {
  var data = [{
    values: dataset.map(row => row.id),
    labels: dataset.map(row => row[`${property}`]),
    type: 'pie',
    // text: ['1 Artist', '2 Artists', '3 Artists', '4+ Artists'],
    textinfo: 'text+value+percent'
  }];

  var layout = {
    height: 400,
    width: 500,
    // legend: {
    //   title: {
    //     text: 'Number of Artists'
    //   }
    // }
  };

  Plotly.newPlot(chartid, data, layout);
}

function barChart(chartid, dataset) {
  var data = [
    {
      x: dataset.map(row => row.key),
      y: dataset.map(row => row.id),
      type: 'bar'
    }
  ];

  Plotly.newPlot(chartid, data);
}
