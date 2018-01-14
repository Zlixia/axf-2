var Mock = require('mockjs')
var fs = require('fs')

var data = new Mock.mock({
    //轮播图数据
    'bannar|3-5':[
        {
        'id|+1': 1,
        'bannar_img': '@image(320x140,@color)',
        'cids|4':[
            {
                'cid_id|+1': 1,
                'name': '@cname(3,5)'
            }
        ],
        'products|30-50':[
            {
                //子分类id
                'cidId|0-3':10,
                'product_id|+1': 1,
                'product_img': '@image(168x168,@color)',
                'product_name': '@cword(2,8)',
                'price|1-99.1': 10,
                'unit|10-1000': 10 
            }
        ]
        }
    ],
    //最大分类数据
    'categories|15': [
        {
            //大分类的id
            'id|+1': 1,
            //分类的名称
            'name': '@cname(2,5)',
            //分类的图片
            'category_img': '@image(320x76,@color)',
            //分类标题的颜色
            'color': '@color',
            //子分类
            'cids|4': [
                {
                    //子分类的名称
                    'name': '@cname(2,8)',
                }
            ],
            //保存分类所对应的商品数据
            'products': []
        }
    ],
    //所有的商品
    'products|150-300': [
        {
            //商品的id
            'id|+1': 1,
            //商品对应的分类id
            'categoryId|1-15': 10,
            //该商品对应的子分类的id
            'cidsId|0-3': 10,
            //商品的名称
            'name': '@cname(2,5)',
            //商品的图片
            'imgs': {
                //列表页使用的缩略图
                'min': '@image(80x80,@color,@cword)',
                //详情页使用的大图
                'big': '@image(300x300,@color,@cword)'
            },
            //商品的价格
            'price|1-99.1': 10,
            //商品的规格
            'unit|10-1000': 10,
            //商品的保质期
            'expiration_date|1-3.1': 10,
            // 商品的品牌
            'brand': '@cword(2, 6)',
            //商品的产原地
            'place_of_origin': '@cword(2,4)',
            //每个商品的数量
            'num': 0,
            //商品详情
            'details': '@cparagraph()'
        }
    ],
    //用户信息表
    /* 
    {
        id,
        phone
        // 当前选择的地址
        select_site
    }
    */
    'users': [],
    // 购物车表
    /* 
    {
        商品在购物车中表的 id,
        商品的id product_id,
        用户id user_id,
        商品的数量,
        商品的图片,
        商品的名称,
        商品的价格,
        是否选择
    }
    */
    'carts': [],
    //目前之前送货的城市
    //"citys": ["北京市", "上海市", "广州市", "深圳市", "天津市", "承德市", "廊坊市", "南京市"]
    "citys": [
        {
            "city": "北京",
            "name": "天安门",
            "x": 116.403963,
            "y": 39.915119
        },
        {
          "city": "深圳市",
          "name": "灵芝",
          "x": 113.910988,
          "y": 22.5754
        },
        {
            "city": "广州市",
            "name": "大新银行",
            "x": 113.261512,
            "y": 23.138287
        },
        {
            "city": "上海市",
            "name": "上海博物馆",
            "x": 121.481584,
            "y": 31.234816
        },
        {
            "city": "荆州市",
            "name": "荆州花园",
            "x": 112.22863,
            "y": 30.356042  
        }
    ],
    // 用户存储所有用户的地址信息
  /* 
    {
      id: 地址在地址表中的id
      用户id，这个地址是哪个用户的
      联系人，
      性别，
      手机号码，
      城市,
      地区，
      详细地址,->百度地图
      坐标数据
    }
  */
    "sites": [],
    //收藏列表
    /*
      id: 商品在收藏表中的id,
      用户id，这个收藏的商品是哪个用户的, user_id
      商品的id, product_id
      商品图片，img(小图)
      商品名称，name
      商品的单位，unit
      商品的价格，price
    */
    "favorList": []
})

fs.writeFile('db.json', JSON.stringify(data, null, 2),function () {
    console.log('写入成功')
})