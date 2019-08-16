const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development"
const config = require(path.join(__dirname,"..","config","config.json"))[env];
const db = {};

const sequelize = new Sequelize(config.database,config.username,config.password,config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Category = require("./category")(sequelize,Sequelize);
db.DisplayInfo = require("./display_info")(sequelize,Sequelize);
db.DisplayInfoImage = require("./display_info_image")(sequelize,Sequelize);
db.FileInfo = require("./file_info")(sequelize,Sequelize);
db.ProductImage = require("./product_image")(sequelize,Sequelize);
db.ProductPrice = require("./product_price")(sequelize,Sequelize);
db.Product = require("./product")(sequelize,Sequelize);
db.Promotion = require("./promotion")(sequelize,Sequelize);
db.ReservationInfoPrice = require("./reservation_info_price")(sequelize,Sequelize);
db.ReservationInfo = require("./reservation_info")(sequelize,Sequelize);
db.ReservationUserCommentImage = require("./reservation_user_comment_image")(sequelize,Sequelize);
db.ReservationUserComment = require("./reservation_user_comment")(sequelize,Sequelize);

db.Category.hasMany(db.Product,{foreignKey:"category_id",sourceKey:"id"});
db.Product.belongsTo(db.Category,{foreignKey:"category_id",targetKey:"id"});

db.Product.hasMany(db.Promotion,{foreignKey:"product_id",sourceKey:"id"});
db.Promotion.belongsTo(db.Product,{foreignKey:"product_id",targetKey:"id"});

db.Product.hasMany(db.ProductImage,{foreignKey:"product_id",sourceKey:"id"});
db.ProductImage.belongsTo(db.Product,{foreignKey:"product_id",targetKey:"id"});

db.Product.hasMany(db.DisplayInfo,{foreignKey:"product_id",sourceKey:"id"});
db.DisplayInfo.belongsTo(db.Product,{foreignKey:"product_id",targetKey:"id"});

db.Product.hasMany(db.ReservationUserComment,{foreignKey:"product_id",sourceKey:"id"});
db.ReservationUserComment.belongsTo(db.Product,{foreignKey:"product_id",targetKey:"id"});

db.Product.hasMany(db.ReservationInfo,{foreignKey:"product_id",sourceKey:"id"});
db.ReservationInfo.belongsTo(db.Product,{foreignKey:"product_id",targetKey:"id"});

db.DisplayInfo.hasMany(db.ReservationInfo,{foreignKey:"display_info_id",sourceKey:"id"});
db.ReservationInfo.belongsTo(db.DisplayInfo,{foreignKey:"display_info_id",targetKey:"id"});

db.Product.hasMany(db.ProductPrice,{foreignKey:"product_id",sourceKey:"id"});
db.ProductPrice.belongsTo(db.Product,{foreignKey:"product_id",targetKey:"id"});

db.DisplayInfo.hasMany(db.DisplayInfoImage,{foreignKey:"display_info_id",sourceKey:"id"});
db.DisplayInfoImage.belongsTo(db.DisplayInfo,{foreignKey:"display_info_id",targetKey:"id"});

db.FileInfo.hasMany(db.DisplayInfoImage,{foreignKey:"file_id",sourceKey:"id"});
db.DisplayInfoImage.belongsTo(db.FileInfo,{foreignKey:"file_id",targetKey:"id"});

db.FileInfo.hasMany(db.ProductImage,{foreignKey:"file_id",sourceKey:"id"});
db.ProductImage.belongsTo(db.FileInfo,{foreignKey:"file_id",targetKey:"id"});

db.FileInfo.hasMany(db.ReservationUserCommentImage,{foreignKey:"file_id",sourceKey:"id"});
db.ReservationUserCommentImage.belongsTo(db.FileInfo,{foreignKey:"file_id",targetKey:"id"});

db.ProductPrice.hasMany(db.ReservationInfoPrice,{foreignKey:"product_price_id",sourceKey:"id"});
db.ReservationInfoPrice.belongsTo(db.ProductPrice,{foreignKey:"product_price_id",targetKey:"id"});

db.ReservationInfo.hasMany(db.ReservationInfoPrice,{foreignKey:"reservation_info_id",sourceKey:"id"});
db.ReservationInfoPrice.belongsTo(db.ReservationInfo,{foreignKey:"reservation_info_id",targetKey:"id"});

db.ReservationInfo.hasMany(db.ReservationUserComment,{foreignKey:"reservation_info_id",sourceKey:"id"});
db.ReservationUserComment.belongsTo(db.ReservationInfo,{foreignKey:"reservation_info_id",targetKey:"id"});

db.ReservationInfo.hasMany(db.ReservationUserCommentImage,{foreignKey:"reservation_info_id",sourceKey:"id"});
db.ReservationUserCommentImage.belongsTo(db.ReservationInfo,{foreignKey:"reservation_info_id",targetKey:"id"});

db.ReservationUserComment.hasMany(db.ReservationUserCommentImage,
    {foreignKey:"reservation_user_comment_id",sourceKey:"id"});
db.ReservationUserCommentImage.belongsTo(db.ReservationUserComment,
    {foreignKey:"reservation_user_comment_id",targetKey:"id"});


module.exports = db;