import pdfParse from "pdf-parse";

export const handleUpload = async (req, res) => {
  const { cvFile, coverLetterFile, jobAdFile } = req.files;

  if (!cvFile && !coverLetterFile && !jobAdFile) {
    return res.status(400).json({ error: "Inga filer laddades upp." });
  }

  const results = {};

  try {
    if (cvFile && cvFile[0]) {
      console.log("Mottagit CV-fil:", cvFile[0].originalname);
      const cvData = await pdfParse(cvFile[0].buffer);
      results.cvText = cvData.text;
    }

    if (coverLetterFile && coverLetterFile[0]) {
      console.log(
        "Mottagit Personligt brev-fil:",
        coverLetterFile[0].originalname
      );
      const coverLetterData = await pdfParse(coverLetterFile[0].buffer);
      results.coverLetterText = coverLetterData.text;
    }

    if (jobAdFile && jobAdFile[0]) {
      console.log("Mottagit Jobbannons-fil:", jobAdFile[0].originalname);
      const jobAdData = await pdfParse(jobAdFile[0].buffer);
      results.jobAdText = jobAdData.text;
    }

    res.status(200).json({
      message: "Filer laddades upp och text extraherades!",
      ...results,
    });
  } catch (error) {
    console.error(
      "Fel vid behandling av PDF eller extrahering av text:",
      error
    );
    res.status(500).json({
      error: "Kunde inte extrahera text från en eller flera PDF-filer.",
    });
  }
};
