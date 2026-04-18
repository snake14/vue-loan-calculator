Vue.component('estimate-payment-breakdown', {
	props: {
		displayResult: { type: Function },
		showLoading: { type: Function },
		hideLoading: { type: Function }
	},
	data() {
		return {
			confirmClearInputs: 'clear_inputs_confirm_modal',
			confirmClearMessage: 'Are you sure that you want to clear the current inputs?',
			frequencies: PAYMENT_FREQUENCIES,
			frequency: null,
			loanAmount: null,
			totalPayAmount: null,
			feeAmount: 0,
			interestRate: null
		}
	},
	methods: {
		clearInputs: function () {
			// Clear the various inputs.
			this.frequency = null;
			this.loanAmount = null;
			this.totalPayAmount = null;
			this.feeAmount = 0;
			this.interestRate = null;
		},
		submitForm: function (event) {
			event.preventDefault();

			// Validate the form before trying to select a number.
			$form = $('#estimatePaymentBreakdownForm');
			var isValid = $form[0].checkValidity();
			$form.addClass('was-validated');
			// If validation failed, don't submit the form.
			if(isValid === false) {
				return false;
			}

			this.showLoading();
		
			// Perform actual calculation
			const loanHelper = new LoanHelper();
			const result = loanHelper.calculatePayment(this.loanAmount, this.totalPayAmount, this.feeAmount, this.interestRate, this.frequency);
			const message = this.buildResponse(result);

			this.hideLoading();
			this.displayResult(message);
		},
		buildResponse: function (result) {
			return `<div class="container">
				<div class="row"">
					<span class="col">
						<label>Total payment amount:</label>
					</span>
					<span class="col-md-auto">
						<label>${Number(this.totalPayAmount).toLocaleString(undefined, { minimumFractionDigits: 2,  maximumFractionDigits: 2 })}</label>
					</span>
				</div>
				<div class="row">
					<span class="col">
						<label>Principal amount:</label>
					</span>
					<span class="col-md-auto">
						<label>${result.principal.toLocaleString(undefined, { minimumFractionDigits: 2,  maximumFractionDigits: 2 })}</label>
					</span>
				</div
				><div  class="row">
					<span class="col">
						<label>Interest amount:</label>
					</span>
					<span class="col-md-auto">
						<label>${result.interest.toLocaleString(undefined, { minimumFractionDigits: 2,  maximumFractionDigits: 2 })}</label>
					</span>
				</div>
				<div class="row">
					<span class="col">
						<label>Other amount:</label>
					</span>
					<span class="col-md-auto">
						<label>${Number(result.other).toLocaleString(undefined, { minimumFractionDigits: 2,  maximumFractionDigits: 2 })}</label>
					</span>
				</div>
			`;
		}
	},
	computed: {
		frequencyState() {
			return this.frequency === null ? null : this.frequency > 0;
		},
		loanAmountState() {
			return this.loanAmount === null ? null : this.loanAmount > 0;
		},
		totalPayAmountState() {
			return this.totalPayAmount === null ? null : this.totalPayAmount > 0;
		},
		feeAmountState() {
			return this.feeAmount === null || this.feeAmount === 0 ? null : this.feeAmount > 0;
		},
		interestRateState() {
			return this.interestRate === null ? null : this.interestRate > 0;
		},
	},
	template: `
		<div>
			<b-form class="form" id="estimatePaymentBreakdownForm">
				<b-form-group
					label="Loan amount"
					label-for="loanAmount"
				>
					<b-form-input type="number" name="loanAmount" id="loanAmount" class="form-control" v-model="loanAmount" :state="loanAmountState" min="0" step=".01" required></b-form-input>
				</b-form-group>
				<b-form-group
					label="Total payment amount"
					label-for="totalPayAmount"
				>
					<b-form-input type="number" name="totalPayAmount" id="totalPayAmount" class="form-control" v-model="totalPayAmount" :state="totalPayAmountState" min="0" step=".01" required></b-form-input>
				</b-form-group>
				<b-form-group
					label="Fee amount (escrow)"
					label-for="feeAmount"
				>
					<b-form-input type="number" name="feeAmount" id="feeAmount" class="form-control" v-model="feeAmount" :state="feeAmountState" min="0" step=".01" required></b-form-input>
				</b-form-group>
				<b-form-group
					label="Interest rate"
					label-for="interestRate"
				>
					<b-form-input type="number" name="interestRate" id="interestRate" class="form-control" v-model="interestRate" :state="interestRateState" min="0" step=".01" required></b-form-input>
				</b-form-group>
				<b-form-group
					label="Payment frequency"
					label-for="frequency"
				>
					<b-form-select v-model="frequency" :options="frequencies" :state="frequencyState" required>
						<!-- This slot appears above the options from 'options' prop -->
						<template #first>
							<b-form-select-option :value="null" disabled>-- Frequency? --</b-form-select-option>
						</template>
					</b-form-select>
				</b-form-group>
				<b-form-group class="text-right">
					<b-button variant="secondary" v-b-modal.clear_inputs_confirm_modal>Clear</b-button>
					<b-button type="submit" variant="primary" @click="submitForm">Submit</b-button>
				</b-form-group>
			</b-form>
			<confirm-modal :id="confirmClearInputs" :message="confirmClearMessage" :on-yes-function="clearInputs" />
		</div>
	`
});