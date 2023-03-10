import {
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  Pagination,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FacilitiesSearch from "./FacilitiesSearch";
export default function Facilities({ swAlert }) {
  const [facilities, setFacilities] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  let pageNumInSessionStg = sessionStorage.getItem("pageNum");
  let keywordInSessionStg = sessionStorage.getItem("keyword");

  const [load, setLoad] = useState(false);

  const loadFacilities = (pageNumInSessionStg, keywordInSessionStg) => {
    setLoad(false);

    axios
      .get("/getFacilitiesList", {
        params: { pageNum: pageNumInSessionStg, keyword: keywordInSessionStg },
      })
      .then((result) => {
        const { facilitiesList, totalPage, pageNum, keyword } = result.data;
        setTotalPage(totalPage);
        setPageNum(pageNum);
        setKeyword(keyword);
        setFacilities(facilitiesList);
        setLoad(true);
        sessionStorage.setItem("pageNum", pageNum);
        sessionStorage.setItem("keyword", keyword);
      });
  };

  useEffect(() => {
    pageNumInSessionStg !== null
      ? keywordInSessionStg !== null
        ? loadFacilities(pageNumInSessionStg, keywordInSessionStg)
        : loadFacilities(pageNumInSessionStg, "")
      : loadFacilities(pageNum, keyword);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlepageNum = (value) => {
    loadFacilities(value, keyword);
  };

  const BasicTableRow = styled(TableRow)({
    maxHeight: 68,
    ":hover": { backgroundColor: `#ffd2e2`, transition: `0.3s` },
  });

  const deleteFacilities = (facilitiesCode) => {
    axios.delete(`/deleteFacilities/${facilitiesCode}`).then((result) => {
      if (result.data === "togetherExist") {
        swAlert("?????? ???????????? ?????? ?????????<br/> ??????????????? ????????????<br/> ????????? ??????????????????.", "warning");
        loadFacilities(pageNum, keyword);
      } else if (result.data === "ok") {
        swAlert("?????? ????????? ????????? ??????????????? ??????????????????.");
        loadFacilities(pageNum, keyword);
      } else {
        swAlert(
          "?????? ????????? ?????? ????????? <br/> ??????????????? ???????????? ???????????????.<br/>?????? ??? ?????? ??????????????????.",
          "warning"
        );
      }
    });
  };

  return (
    <Container component="main" align="center" sx={{ mt: 13 }}>
      <Box>
        <Typography variant="h4">?????? ??????</Typography>
        <FacilitiesSearch
          keyword={keyword}
          setKeyword={setKeyword}
          pageNum={pageNum}
          loadFacilities={loadFacilities}
        />
        <Link to="/manager/facilities/insertFacilities" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={{ float: "right" }}>
            ?????? ??????
          </Button>
        </Link>
      </Box>

      <TableContainer component="main" sx={{ width: "100%", height: 480 }}>
        <Table aria-label="simple table">
          <TableHead style={{ borderBottom: "2px solid black" }}>
            <TableRow>
              <TableCell align="center" width="20%">
                ????????????
              </TableCell>
              <TableCell align="center" width="20%">
                ?????? ???
              </TableCell>
              <TableCell align="center" width="20%">
                ????????????
              </TableCell>
              <TableCell align="center" width="20%">
                ??????
              </TableCell>
              <TableCell align="center" width="20%">
                ??????/??????
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {load === false ? (
              <TableRow>
                <TableCell
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                  }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              facilities.map((facilities, index) => (
                <BasicTableRow key={index}>
                  <TableCell align="center">{facilities.facilitiesCode}</TableCell>

                  <TableCell align="center">
                    <Link
                      to={`/manager/facilities/getFacilitiesInfo/${facilities.facilitiesCode}`}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      {facilities.facilitiesName}{" "}
                    </Link>
                  </TableCell>

                  <TableCell align="center">{facilities.facilitiesManager}</TableCell>
                  <TableCell align="center">{facilities.facilitiesGrade}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup>
                      <Link
                        to={`/manager/facilities/updateFacilities/${facilities.facilitiesCode}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button>????????????</Button>
                      </Link>
                      <Button onClick={() => deleteFacilities(facilities.facilitiesCode)}>????????????</Button>
                    </ButtonGroup>
                  </TableCell>
                </BasicTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} alignItems="center" mt={1}>
        <Pagination
          count={totalPage}
          onChange={(e, value) => handlepageNum(value)}
          color="primary"
          page={pageNum}
        />
      </Stack>
    </Container>
  );
}
