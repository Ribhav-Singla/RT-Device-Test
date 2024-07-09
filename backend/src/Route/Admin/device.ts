import express from "express";
import { Device } from "../../Models/Device";
import { adminAuth } from "../../Middleware/admin";
import { Employee } from "../../Models/Employee";
import { returnAllDevice } from "../../Controllers";
import mongoose from "mongoose";

export const deviceRouter = express.Router();

deviceRouter.get('/models',async(req,res)=>{
  try {
      const models = await Device.find({},{model:1})
      return res.status(200).json({ models })
  } catch (error) {
      console.log('error occured while getting models: ',error);
      return res.status(500).json({
          message: 'error occured while getting models'
      })
  }
})

deviceRouter.get("/bulk", adminAuth, async (req, res) => {
  const filter = req.query.filter || '';
  const page = req.query.page || '';
  const limit = Number(req.query.perPage) || 5
  const skip = page ? (Number(page) - 1) * limit : 0

  try {
    const devices = await Device.find({
      $or: [
        { model: { $regex: filter, $options: "i" } },
        {
          company: { $regex: filter, $options: "i" },
        },
      ],
    })
      .skip(skip)
      .limit(limit)
      .sort({ 'createdAt': -1 })
    const totalDevices = await Device.find({
      $or: [
        { model: { $regex: filter, $options: "i" } },
        {
          company: { $regex: filter, $options: "i" },
        },
      ],
    }).countDocuments();
    return res.json({
      totalDevices: totalDevices,
      devices: devices,
    });
  } catch (error) {
    console.log("something went wrong while getting devices in bulk: ", error);
    return res.status(500).json({
      message: "something went wrong while getting devices in bulk",
    });
  }
});

deviceRouter.get("/:id", adminAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }
    return res.json({ device });
  } catch (error) {
    console.log("something went wrong while getting device: ", error);
    return res.status(500).json({
      message: "something went wrong while getting device",
    });
  }
});

deviceRouter.post("/create", adminAuth, async (req, res) => {

  try {
    const device = new Device({
      model: req.body.model,
      company: req.body.company,
      image: req.body.image
    });
    await device.save();
    return res.status(200).json({
      message: "Device Created Successfully",
    });
  } catch (error) {
    console.log("error occured while creating device: ", error);
    return res.status(500).json({
      message: "something went wrong!",
    });
  }
});

deviceRouter.put("/update/:id", adminAuth, async (req, res) => {
  try {
    await Device.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          model: req.body.model,
          company: req.body.company,
          image: req.body.image
        },
      }
    );

    return res.status(200).json({
      message: "Device Updated Successfully",
    });
  } catch (error) {
    console.log("error occured while updating employee: ", error);
    return res.status(500).json({
      message: "something went wrong!",
    });
  }
});

deviceRouter.delete("/delete/:id", adminAuth, async (req, res) => {
  try {
    await Device.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      message: "Device Deleted Successfully",
    });
  } catch (error) {
    console.log("error occured while deleting device: ", error);
    return res.status(500).json({
      message: "something went wrong!",
    });
  }
});
