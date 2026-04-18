Vue.component('confirm-modal', {
	props: {
		id: String,
		message: String,
		onYesFunction: { type: Function }
	},
	methods: {
		closeModal: function () {
			this.$bvModal.hide(this.id);
		},
		submitForm: function (event) {
			event.preventDefault();

			// Call the function that is supposed to be executed when the user selects yes.
			this.onYesFunction();

			// Hide the modal.
			this.$bvModal.hide(this.id);
		}
	},
	template: `
		<b-modal :id="id" :title="message" hide-footer>
			<b-form id="yes_no_form" @submit="submitForm">
				<b-form-group class="mb-0 text-right">
					<b-button variant="secondary" @click="closeModal">No</b-button>
					<b-button type="submit" variant="primary">Yes</b-button>
				</b-form-group>
			</b-form>
		</b-modal>
	`
});