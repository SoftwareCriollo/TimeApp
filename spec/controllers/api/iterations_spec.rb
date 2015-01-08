require 'rails_helper'

RSpec.describe Api::IterationsController, :type => :controller do

describe 'POST #create' do

  context 'Create new iteration' do
    let(:iteration){FactoryGirl.attributes_for(:iteration) }
    it 'Redirects them to their /' do
      post :create, iteration: iteration
      expect(response.status).to eq(201)
    end
    end
end

end

