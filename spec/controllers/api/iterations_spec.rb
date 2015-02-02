require 'rails_helper'

RSpec.describe Api::IterationsController, :type => :controller do

  describe 'POST #create' do
    context 'valid attributes' do
      let(:iteration){FactoryGirl.attributes_for(:iteration) }
      let(:valid_request){ post :create, iteration: iteration, project_id: 'project_id' }
      let(:invalid_request) { post :create, iteration: {no_attr: "not"} , project_id: 'project_id'}
      include_examples "resource", Iteration
    end
  end
end
