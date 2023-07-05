import {
    Box,
    Stack,
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import {
    useRef,
    useState,
    useEffect,
    ChangeEvent,
} from 'react';
import { getDocument } from 'pdfjs-dist';
// import * as pdfjs from 'pdfjs-dist';
import "pdfjs-dist/build/pdf.worker.entry";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const App = () => {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        (async () => {
            const fileUrl = !!file ? URL.createObjectURL(file) : '';
            if (!!canvasEl.current && !!fileUrl) {
                const loadingTask = await getDocument({ url: fileUrl });
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);

                const canvasContext = canvasEl.current.getContext('2d') as CanvasRenderingContext2D;
                const viewport = page.getViewport({ scale: .3, dontFlip: false, });

                canvasEl.current.width = viewport.width;
                canvasEl.current.height = viewport.height;

                const renderContext = { canvasContext, viewport };
                await page.render(renderContext);
            }
        })();
    }, [file]);

    const handleFile = (event: ChangeEvent<HTMLInputElement>) => setFile(event.target?.files ? event.target.files[0] : null);

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    marginBottom: '20px'
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'center'
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 'bolder',
                        }}
                    >
                        Test App
                    </Typography>
                </Toolbar>
            </AppBar>
            <Stack alignItems="center">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFile}
                    id="raised-button-file"
                    style={{ display: 'none' }}
                />
                <Typography>
                    {file?.name}
                </Typography>
                <label htmlFor="raised-button-file">
                    <Button
                        component="span"
                        variant="contained"
                        color="secondary"
                        sx={{
                            width: '200px',
                            marginBottom: '20px',
                        }}
                    >
                        Upload
                    </Button>
                </label>
                <Box
                    sx={{
                        overflow: 'hidden',
                        background: grey[500],
                    }}
                >
                    <canvas ref={canvasEl}></canvas>
                </Box>
            </Stack >
        </>
    );
}

export default App;