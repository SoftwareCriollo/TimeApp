require 'rails_helper'

RSpec.describe Api::ClientsController, :type => :controller do

  describe 'POST #create' do
    context 'valid attributes' do
      let(:client){FactoryGirl.attributes_for(:client) }
      let(:valid_request){ post :create, client: client, project_id: 'project_id' }
      let(:invalid_request) { post :create, client: {no_attr: "not"} , project_id: 'project_id'}
      include_examples "resource", Client
    end
  end
end
