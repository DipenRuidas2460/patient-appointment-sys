const CustomerBusiness = require("../models/CustomerBusiness");
const User = require("../models/User");

const createCustomerBusiness = async (req, res) => {
  try {
    const { customerId } = req.body;

    const obj = { customerId: customerId, businessId: req.person.businessId };

    await CustomerBusiness.create(obj)
      .then((customerData) => {
        return res.status(201).json({
          status: 200,
          data: customerData,
          message: "Customer successfully created!",
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(200)
          .json({ status: 400, message: "An Error Occured!" });
      });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
};

const fetchAllCustomerByBusinessId = async (req, res) => {
  try {
    const { page, pageSize } = req.body;

    await CustomerBusiness.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
      where: { businessId: req.person.businessId },
      include: {
        model: User,
        as: "customer",
        attributes: [
          "id",
          "name",
          "email",
          "guiId",
          "address",
          "phone",
          "dob",
          "city",
          "zipCode",
        ],
      },
    })
      .then(({ count, rows }) => {
        return res.status(200).json({
          status: 200,
          data: rows,
          pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize: pageSize,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(200)
          .json({ status: 400, message: "An Error Occured!" });
      });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = { createCustomerBusiness, fetchAllCustomerByBusinessId };
