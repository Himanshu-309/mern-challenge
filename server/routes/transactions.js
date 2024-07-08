const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Utility function to get the start and end dates of a month
const getMonthDateRange = (month) => {
  const year = new Date().getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return { start, end };
};

// Route to fetch statistics
router.get('/statistics', async (req, res) => {
  // try {
  //   const { month } = req.query;
  //   const { start, end } = getMonthDateRange(parseInt(month, 10));

  //   const totalSales = await Transaction.aggregate([
  //     { $match: { dateOfSale: { $gte: start, $lte: end } } },
  //     { $group: { _id: null, totalAmount: { $sum: '$price' }, totalSoldItems: { $sum: { $cond: ["$sold", 1, 0] } } } }
  //   ]);

  //   const notSoldItems = await Transaction.countDocuments({
  //     dateOfSale: { $gte: start, $lte: end },
  //     sold: false
  //   });

  //   res.json({
  //     totalSales: totalSales[0] ? totalSales[0].totalAmount : 0,
  //     totalSoldItems: totalSales[0] ? totalSales[0].totalSoldItems : 0,
  //     totalNotSoldItems: notSoldItems
  //   });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send('Error fetching statistics');
  // }


  const month = parseInt(req.query.month);

    const data = await Transaction
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: [
                { $month: { $dateFromString: { dateString: "$dateOfSale" } } },
                month,
              ],
            },
          },
        },
        {
          $facet: {
            totalAmount: [
              {
                $group: {
                  _id: null,
                  totalAmount: {
                    $sum: "$price",
                  },
                },
              },
            ],
            soldStatus: [
              {
                $group: {
                  _id: "$sold",
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ])
    console.log(data);

    let totalSold, totalNotSold;
    if (data[0].soldStatus[0]._id === true) {
      totalSold = data[0].soldStatus[0].count;
      totalNotSold = data[0].soldStatus[1].count;
    }
    if (data[0].soldStatus[0]._id === false) {
      totalNotSold = data[0].soldStatus[0].count;
      totalSold = data[0].soldStatus[1].count;
    }
    res.json({
      totalAmount:
        data[0].totalAmount.length > 0 ? data[0].totalAmount[0].totalAmount : 0,
      totalSold: totalSold,
      totalNotSold: totalNotSold,
    });

});

// Route to fetch bar chart data
router.get('/bar-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const { start, end } = getMonthDateRange(parseInt(month, 10));

    const barChartData = await Transaction.aggregate([
      { $match: {
            $expr: {
              $eq: [
                { $month: { $dateFromString: { dateString: "$dateOfSale" } } },
                month,
              ],
            },
          },
        },,
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "901-above",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.json(barChartData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching bar chart data');
  }
});

// Route to fetch pie chart data
router.get('/pie-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const { start, end } = getMonthDateRange(parseInt(month, 10));

    const pieChartData = await Transaction.aggregate([
      { $match: {
            $expr: {
              $eq: [
                { $month: { $dateFromString: { dateString: "$dateOfSale" } } },
                month,
              ],
            },
          },
        },,
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json(pieChartData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching pie chart data');
  }
});

module.exports = router;
