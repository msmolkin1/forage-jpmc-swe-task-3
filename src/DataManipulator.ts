import { ServerRespond } from './DataStreamer';

// This file is responsible for processing the raw stock data we receive from the server before the Graph component renders it.

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  static threshold: number = 0.11;
  static generateRow(serverResponds: ServerRespond[]) {
    const priceABC = (serverResponds[0].top_bid.price + serverResponds[0].top_ask.price) / 2;
    const priceDEF = (serverResponds[1].top_bid.price + serverResponds[1].top_ask.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + this.threshold;
    const lowerBound = 1 - this.threshold;

    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined, // For consistency and maximum verbosity, ratio should always be a number, not a boolean.
    }
  }
}
