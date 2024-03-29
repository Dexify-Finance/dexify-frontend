import { FundCategoryType } from '../components/CreateVaultBasics/categories';
import { AssetDto } from './asset';
import { ComptrollerDto } from './comptroller';
import { FundUserDto } from './fundUser';
import { PortfolioDto } from './portfolio';
import { ShareStateDto } from './share';

export class FundDto extends FundOverview {
  portfolioHistory?: PortfolioDto[];
  lastPortfolio?: PortfolioDto[];
  sharesHistory?: ShareStateDto[];
  lastShare?: ShareStateDto[];

  //
  sharePriceChanges?: number;
  aumChanges?: number;
}

type Monthly = {
  year: number,
  month: number,
  aumChangeBips: number | undefined,
  sharePriceChangeBips: number | undefined
}

export class FundOverviewWithHistoryResponse extends FundOverview {
  totalShares?: number;

  sparkline?: string;
  sparkline_shares?: string;

  sharePriceChanges?: number;
  aumChanges?: number;

  aumHistory?: number[];
  sharePriceHistory?: number[];
  timeHistory?: number[];

  monthlyStates?: Monthly[];

  sharpeRatio?: number;
  volatility?: number;
}


export class FundOverview {
  id: string;
  name: string;
  image?: string;
  description?: string;
  category?: FundCategoryType;
  accessor?: ComptrollerDto;
  creator?: FundUserDto;
  manager?: FundUserDto;
  portfolio?: PortfolioDto;
  inception?: string;
  aum?: number;
  aum1WAgo?: number;
  shares?: ShareStateDto;
  totalShareSupply?: number;
  totalShareSupply1WAgo?: number;
  sharePrice?: number;
  sharePrice1WAgo?: number;
  assets?: (AssetDto & {aum: number})[];
}

export class FundMeta {
  address: string;
  image?: string;
  category: number;
  description?: string;
}