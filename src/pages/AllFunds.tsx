import { useState, useCallback, useEffect } from "react";
import useMediaQuery from "../hooks/useMediaQuery";
import { useAppSelector } from "../store";
import { Avatar, Pagination, Table } from "flowbite-react";
import { all_fund_table_fields } from "../constants/all_fund_table_fields";
import { calcChanges, formatNumber } from "../helpers/number";
import { getTokenInfo } from "../helpers";
import TableRowSkeleton from "../components/Skeleton/TableRowSkeleton";
import { PAGE_SIZE } from "../constants";
import { FundOverview } from "../@types";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import CustomBreadcrumbs from "../components/Breadcrumbs";
import { BreadCrumbPath } from "../components/Breadcrumbs";
import { FundCategoryType } from "../components/CreateVaultBasics/categories";

export default function AllFunds() {
  const matches = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const location = useLocation();
  const [pathData, setPathData] = useState<BreadCrumbPath[]>([]);
  const [category, setCategory] = useState<number>(-1);

  const { data: totalFunds, loading } = useAppSelector(
    (state) => state.allFunds
  );
  const [funds, setFunds] = useState<FundOverview[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortData, setSortData] = useState<{
    field: string;
    direction: "desc" | "asc";
  }>({
    field: "aum",
    direction: "desc",
  });

  const sortFunction = useCallback(
    (a: FundOverview, b: FundOverview) => {
      switch (sortData.field) {
        case "name":
          if (b.name > a.name) {
            return sortData.direction === "desc" ? 1 : -1;
          } else {
            return sortData.direction === "desc" ? -1 : 1;
          }
        case "aum":
          return sortData.direction === "desc"
            ? (b.aum || 0) - (a.aum || 0)
            : (a.aum || 0) - (b.aum || 0);
        case "changes":
          return sortData.direction === "desc"
            ? calcChanges(b.aum || 0, b.aum1WAgo || 0) -
                calcChanges(a.aum || 0, a.aum1WAgo || 0)
            : calcChanges(a.aum || 0, a.aum1WAgo || 0) -
                calcChanges(b.aum || 0, b.aum1WAgo || 0);
        default:
          return sortData.direction === "desc"
            ? (b.aum || 0) - (a.aum || 0)
            : (a.aum || 0) - (b.aum || 0);
      }
    },
    [sortData]
  );

  useEffect(() => {
    switch (location.pathname) {
      case "/all-funds":
        setCategory(-1);
        break;
      case "/index-funds":
        setCategory(FundCategoryType.INDEX);
        break;
      case "/institution-funds":
        setCategory(FundCategoryType.INSTITUTION);
        break;
      case "/icon-funds":
        setCategory(FundCategoryType.ICON);
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (totalFunds && totalFunds.length > 0 && sortFunction && setFunds) {
      const _funds = totalFunds.filter((item) =>
        category === -1 ? true : item.category === category
      );

      _funds.sort(sortFunction);
      setFunds(
        _funds.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE)
      );
    }
  }, [pageNumber, totalFunds, sortFunction, setFunds, category]);

  const onPageChange = useCallback(
    (page: number) => {
      setPageNumber(page);
    },
    [setPageNumber]
  );

  const handleCellHeaderClicked = (field: {
    title: string;
    key: string;
    sortable: boolean;
  }) => {
    if (!field.sortable) return;
    if (sortData.field === field.key) {
      setSortData({
        ...sortData,
        direction: sortData.direction === "desc" ? "asc" : "desc",
      });
    } else {
      setSortData({
        field: field.key,
        direction: "desc",
      });
    }
  };

  useEffect(() => {
    const path = [{ title: "Home", href: "/" }];
    switch (category) {
      case -1:
        path.push({
          title: "All Funds",
          href: "",
        });
        break;
      case FundCategoryType.INDEX:
        path.push({
          title: "Index Funds",
          href: "",
        });
        break;
      case FundCategoryType.INSTITUTION:
        path.push({
          title: "Institution Funds",
          href: "",
        });
        break;
      case FundCategoryType.ICON:
        path.push({
          title: "Icon Funds",
          href: "",
        });
        break;
    }
    setPathData(path);
  }, [category]);

  return (
    <div className="relative overflow-x-auto w-full">
      <CustomBreadcrumbs path={pathData} />
      <Table hoverable={true} className="whitespace-nowrap mt-3 md:mt-5">
        <Table.Head>
          {all_fund_table_fields.map((field) => (
            <Table.HeadCell
              key={`all-funds-table-header-${field.key}`}
              className={field.sortable ? "cursor-pointer" : ""}
              onClick={() => handleCellHeaderClicked(field)}
            >
              <div className="flex">
                {field.title}
                {field.key === sortData.field && (
                  <>
                    {sortData.direction === "desc" ? (
                      <HiChevronUp className="ml-2" />
                    ) : (
                      <HiChevronDown className="ml-2" />
                    )}
                  </>
                )}
              </div>
            </Table.HeadCell>
          ))}
        </Table.Head>

        <Table.Body className="divide-y">
          {loading ? (
            <Table.Row>
              <TableRowSkeleton />
            </Table.Row>
          ) : (
            funds.map((fund) => (
              <Table.Row
                className="bg-white border-none dark:bg-gray-800 hover:bg-hoverColor cursor-pointer"
                key={`all-funds-table-row-${fund.id}`}
                onClick={() => navigate(`/fund/${fund.id}`)}
              >
                <Table.Cell className="flex items-center gap-3">
                  <Avatar
                    img={fund.image || "/imgs/fund/0.png"}
                    rounded={true}
                    className="min-w-fit"
                  />
                  <span className="font-medium text-title text-[12px] md:text-[14px] dark:text-white">
                    {fund.name}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(fund?.aum || 0)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span
                    className={
                      "font-extrabold " +
                      ((fund?.aum || 0) > (fund?.aum1WAgo || 0)
                        ? "text-success"
                        : "text-danger")
                    }
                  >
                    {formatNumber(
                      calcChanges(fund?.aum || 0, fund?.aum1WAgo || 0)
                    )}
                    %
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Avatar.Group className="-space-x-2 min-w-[150px] md:min-w-fit">
                    {fund?.assets?.slice(0, 4).map((asset, index) => (
                      <Avatar
                        img={
                          getTokenInfo(asset.id)?.logoURI || "/imgs/logo.png"
                        }
                        rounded={true}
                        stacked={true}
                        key={`asset-avatar-${index}`}
                        size={"sm"}
                      />
                    ))}
                    {(fund?.assets?.length || 0) > 4 && (
                      <Avatar.Counter
                        total={(fund?.assets?.length || 0) - 4}
                        href="#"
                        className="w-[32px] h-[32px]"
                      />
                    )}
                  </Avatar.Group>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      <Pagination
        className="all-funds-pagination flex items-center text-[12px] md:text-[14px] mx-auto mt-5 justify-center"
        currentPage={pageNumber}
        totalPages={Math.ceil(totalFunds.length / PAGE_SIZE)}
        onPageChange={onPageChange}
        showIcons={true}
        previousLabel=""
        nextLabel=""
      />
    </div>
  );
}
