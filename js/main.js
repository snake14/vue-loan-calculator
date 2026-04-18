const MONTHLY_PAYMENT_PER_YEAR = 12;
const FORTNIGHTLY_PAYMENT_PER_YEAR = 26;
const WEEKLY_PAYMENT_PER_YEAR = 52;

const PAYMENT_FREQUENCIES = [
	{text: 'Monthly', value: MONTHLY_PAYMENT_PER_YEAR},
	{text: 'Fortnightly', value: FORTNIGHTLY_PAYMENT_PER_YEAR},
	{text: 'Weekly', value: WEEKLY_PAYMENT_PER_YEAR},
];

const UNIT_TYPE_YEAR = 12;
const UNIT_TYPE_MONTH = 1;

// This is for specifying the duration of the loan, like a 30 or 15 year mortgage.
const UNIT_TYPES = [
	{text: 'Years', value: UNIT_TYPE_YEAR},
	{text: 'Months', value: UNIT_TYPE_MONTH},
];

class LoanHelper {
	/**
	 * Calculate the breakdown of a payment based on some key information. The is handy for recursively calculating
	 * all of the remaining payments of a loan.
	 */
	calculatePayment(loanAmount, totalPayAmount, feeAmount, interestRate, payFrequency) {
		if(payFrequency !== MONTHLY_PAYMENT_PER_YEAR && payFrequency !== FORTNIGHTLY_PAYMENT_PER_YEAR && payFrequency !== WEEKLY_PAYMENT_PER_YEAR) {
			return {success: false, message: "The frequency is not Month, Fortnightly, or Weekly"};
		}

		const interest = (loanAmount * (interestRate / 100)) / payFrequency;
		let principal = totalPayAmount - feeAmount;
		principal = principal - interest;
		const remainingPrincipal = loanAmount - principal;

		return {success: true, principal: principal, interest: interest, other: feeAmount, remainingPrincipal: remainingPrincipal};
	}
	
	/**
	 * Calculate the total payment for a single payment period.
	 * M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
	 * P = principal loan amount (350000)
	 * i = monthly interest rate (0.04 / 12 = 0.0033)
	 * n = number of months required to repay the loan (30 x 12 = 360)
	 */
	estimatePaymentAmount(loanAmount, feeAmount, interestRate, termType, termNum) {
		if(termType !== UNIT_TYPE_YEAR && termType !== UNIT_TYPE_MONTH) {
			return "The provided term unit type is not a valid option.";
		}
		
		const totalMonths = termNum * termType;
		const monthlyRate = (interestRate / 100) / 12;
		const dividend = loanAmount * (monthlyRate * Math.pow((1 + monthlyRate), totalMonths));
		const divisor = Math.pow((1 + monthlyRate), totalMonths) - 1;
		let monthlyPayment = (dividend / divisor);
		monthlyPayment = monthlyPayment + feeAmount;

		return monthlyPayment;
	}

	/**
	 * Calculate how long it will take to pay off a loan based on the size of the payment, frequency, and interest rate.
	 */
	calculatePayoffTime(loanAmount, totalPayAmount, feeAmount, interestRate, payFrequency) {
		loanAmount = Number(loanAmount);
		totalPayAmount = Number(totalPayAmount);
		feeAmount = Number(feeAmount);
		interestRate = Number(interestRate);
		payFrequency = Number(payFrequency);
		let remainingPrincipal = loanAmount;
		let paymentCount = 0, months = 0, finalPaymentAmt = 0;
		let totalInterest = 0;
		// Make the standard monthly payment until the remaining principal is less than the usual monthly payment.
		while((remainingPrincipal + feeAmount) >= totalPayAmount) {
			const payment = this.calculatePayment(remainingPrincipal, totalPayAmount, feeAmount, interestRate, payFrequency);
			remainingPrincipal -= payment.principal;
			totalInterest += payment.interest;
			paymentCount++;
		}

		// Calculate the interest for the final payment.
		const interest = (remainingPrincipal * (interestRate / 100)) / payFrequency;
		totalInterest += interest;
		totalInterest = totalInterest;
		finalPaymentAmt = remainingPrincipal + feeAmount + interest;
		paymentCount++;

		// Calculate the number of months based on the number of payments and the payment frequency;
		months = payFrequency === FORTNIGHTLY_PAYMENT_PER_YEAR ? paymentCount / 2 : (payFrequency === WEEKLY_PAYMENT_PER_YEAR ? paymentCount / 4 : paymentCount);

		return {numberOfPayments: paymentCount, numberOfMonths: months, finalPaymentAmount: finalPaymentAmt, totalInterest: totalInterest};
	}
}