const Listing = require('../models/Listing')

const createListing = async (req, res) => {
  try {
    const newListing = await new Listing(req.body)
    await newListing.save()
    return res.status(200).json({ newListing })
  } catch (error) {
    res.json(`Error with createListing: ${error}`)
  }
}

const getListingByUser = async (req, res) => {
  try {
    const { id } = req.params
    const userListings = await Listing.find({ seller_id: id })
    res.status(200).json({ userListings })
  } catch (error) {
    res.json(`Error with getListingByUser: ${error}`)
  }
}

const getAllListings = async (req, res) => {
  try {
    const allListings = await Listing.find()
    return res.status(200).json({ allListings })
  } catch (error) {
    res.json(`Error with getAllListings: ${error}`)
  }
}

const getListingById = async (req, res) => {
  try {
    const { id } = req.params
    const listing = await Listing.findOne({ _id: id })
    return res.status(200).json({ listing })
  } catch (error) {
    res.json(`Error with getListingById: ${error}`)
  }
}

const deleteListing = async (req, res) => {
  try {
    const { id } = req.params
    await Listing.findByIdAndDelete({ _id: id })
    res.json(`Listing deleted`)
  } catch (error) {
    res.json(`Error with deleteListing: ${error}`)
  }
}

const updatePrice = async (req, res) => {
  try {
    const { id } = req.params
    const object = await Listing.findOneAndUpdate(
      { _id: id },
      { price: req.body.price, description: req.body.description }
    )
    res.status(200).json({ object })
  } catch (error) {
    res.json(`Error with updatePrice: ${error}`)
  }
}

module.exports = {
  createListing,
  getListingByUser,
  getAllListings,
  deleteListing,
  getListingById,
  updatePrice
}
