RSpec.shared_examples "resource" do |klass|
  let(:user) { create(:user)}
  before { stubbing_project_manager }
  before { allow_any_instance_of(ApiAuthenticatedController).to receive(:restrict_access).and_return(true)}
  before { allow_any_instance_of(ApiAuthenticatedController).to receive(:current_user).and_return(user)}
  describe "sucessfully" do
    describe "response" do
      before{ valid_request }
      it{ expect(response.status).to eq(201) }
      it{ expect(response.header['Content-Type']).to include('application/json') }
    end
    it "its created" do
      expect { valid_request }.to change(klass, :count ).by(1)
    end
  end
  describe "failed" do
    it{ expect { invalid_request }.to change(klass, :count ).by(0) }
    describe "response" do
      before{ invalid_request }
      it{ expect(response.status).to eq(422) }      
    end
  end


end