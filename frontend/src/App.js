import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import download from 'downloadjs';
import { Typography, Fade } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import Dropzone from './components/Dropzone';

const App = () => {
  const [isOver, setIsOver] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    (async () => {
      const headerFile = await fetch('/pdfs/header.pdf');
      const headerBuffer = await headerFile.arrayBuffer();
      setHeader(headerBuffer);
      const footerFile = await fetch('/pdfs/footer.pdf');
      const footerBuffer = await footerFile.arrayBuffer();
      setFooter(footerBuffer);
    })();
  }, []);

  const create = async (file) => {
    const uploadBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(uploadBuffer);
    const [headerEmbed] = await pdfDoc.embedPdf(header);
    const headerDims = headerEmbed.size();
    const [footerEmbed] = await pdfDoc.embedPdf(footer);
    const footerDims = footerEmbed.size();

    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const scaledFooter = footerEmbed.scale(
        page.getSize().width / footerDims.width
      );
      const scaledHeader = headerEmbed.scale(
        page.getSize().width / headerDims.width
      );

      page.drawPage(headerEmbed, {
        ...scaledHeader,
        x: 0,
        y: page.getSize().height - scaledHeader.height - 17,
      });
      page.drawPage(footerEmbed, {
        ...scaledFooter,
        x: 0,
        y: 5,
      });
    });
    const pdfFile = await pdfDoc.save();
    const dateRegex = /.{10}/;
    const invoiceNameRegex = /AIR\d{4,5}/;
    const standardInvoiceRegex = /Pardavimai - PVM sf/;
    let fileName;
    if (standardInvoiceRegex.test(file.name)) {
      fileName = `${file.name.match(invoiceNameRegex)} ${file.name.match(
        dateRegex
      )}.pdf`;
    } else {
      fileName = file.name;
    }

    download(pdfFile, `${fileName}`, 'application/pdf');
    enqueueSnackbar(`"${fileName}" parsiųsta`, {
      variant: 'success',
      autoHideDuration: 6000,
    });
  };

  const onButtonUplaod = async (event) => {
    await checkAndCreate(event.target.files);
  };

  const checkAndCreate = async (files) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type !== 'application/pdf') {
        enqueueSnackbar(`failas "${files[i].name}" nėra PDF`, {
          variant: 'error',
          autoHideDuration: 6000,
        });
      } else {
        await create(files[i]);
      }
    }
  };

  const display = isOver ? { display: 'none' } : { display: 'flex' };

  return (
    <div>
      <Dropzone
        checkAndCreate={checkAndCreate}
        isOver={isOver}
        setIsOver={(bool) => setIsOver(bool)}
      >
        <Fade in={!isOver}>
          <div className='content' style={display}>
            <img
              className='logo'
              src='/air_idea_logo.png'
              alt='Air Idea Logo'
            />
            <Typography className='pdf' variant='h2'>
              PDF
            </Typography>
            <input
              type='file'
              id='file-selector'
              accept='application/pdf'
              onChange={onButtonUplaod}
              className='custom-file-input'
              multiple
            />
            <Typography variant='body1'>Arba nutempkite jį čia</Typography>
          </div>
        </Fade>
      </Dropzone>
    </div>
  );
};

export default App;
