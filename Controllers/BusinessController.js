import BusinessModel from "../Models/BusinessModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const BusinessController = {};

// ✅ Insert / Update Business Contact
BusinessController.upsertBusinesses = async (req, res) => {
    try {
        // Validate required fields based on NOT NULL fields in DB
        const error = validationService.validateRequired(req.body, [
            "customer_type",
            "contact_person_name",
            "source_id",
            "source_from",
            "remark",
            "tahshil"
        ]);
        if (error) {
            return res.send(getErrorObject(400, 'Missing required fields', error));
        }

        const reqObj = {
            business_id: req.params.id || null,
            customer_type: req.body.customer_type,
            business_name: req.body.business_name || null,
            gst_number: req.body.gst_number || null,
            business_mobile: req.body.business_mobile || null,
            business_alt_mobile: req.body.business_alt_mobile || null,
            business_email_id: req.body.business_email_id || null,
            contact_person_name: req.body.contact_person_name,
            contact_mobile: req.body.contact_mobile || null,
            contact_person_alt_mobile: req.body.contact_person_alt_mobile || null,
            contact_email_id: req.body.contact_email_id || null,
            source_id: req.body.source_id,
            source_from: req.body.source_from,
            remark: req.body.remark,
            state: req.body.state || null,
            district: req.body.district || null,
            block: req.body.block || null,
            tahshil: req.body.tahshil,
            post: req.body.post || null,
            vill: req.body.vill || null,
        };

        const result = await BusinessModel.upsertBusinesses(reqObj);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error in upsertBusiness", err));
    }
};

// ✅ Get Business Contacts (with filters & pagination)
BusinessController.getBusinesses = async (req, res) => {
    try {
        // return res.send(500, "Internal Server Error in getBusiness")
        const error = validationService.validateRequired(req.query, ['page', 'perPage']);
        if (error) {
            return res.send(getErrorObject(400, 'Missing pagination fields', error));
        }

        const result = await BusinessModel.getBusinesses(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error in getBusiness", err));
    }
};

// // ✅ Delete Business Contact
BusinessController.deleteBusiness = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) {
            return res.send(getErrorObject(400, 'Missing ID', error));
        }

        await BusinessModel.deleteBusinesses(req.params.id);
        return res.send(getSuccessObject({ message: 'Business contact deleted successfully.' }));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error in deleteBusiness", err));
    }
};

export default BusinessController;
