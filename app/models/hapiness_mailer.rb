class HapinessMailer

	def send_to_all_clients
		@clients = Client.all
		@clients.each do | client |
			puts "enviando correo a #{client.email}"
			ClientMailer.hapiness(client).send
		end
	end

end